from datetime import date, datetime, timedelta
from collections import defaultdict
from typing import Dict, Any, List, Tuple
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from database.models.employee_model import Employee
from database.models.attendance_model import Attendance
from database.models.leaveRequeast_model import LeaveRequeast

def _month_range_endpoints(months_back: int = 12) -> List[Tuple[date, date, str]]:
    """Returns list of (month_start, month_end, label) for the last N months (inclusive of current)."""
    today = date.today().replace(day=1)
    out: List[Tuple[date, date, str]] = []
    cur = today
    for _ in range(months_back):
        start = cur
        if cur.month == 12:
            next_m = date(cur.year + 1, 1, 1)
        else:
            next_m = date(cur.year, cur.month + 1, 1)
        end = next_m - timedelta(days=1)
        label = start.strftime("%Y-%m")
        out.append((start, end, label))
        # move back one month
        prev_last = start - timedelta(days=1)
        cur = prev_last.replace(day=1)
    out.reverse()
    return out

def _daterange(start: date, end: date):
    cur = start
    while cur <= end:
        yield cur
        cur += timedelta(days=1)

def _weekday_count_in_range(start: date, end: date) -> int:
    cnt = 0
    for d in _daterange(start, end):
        if d.weekday() < 5:
            cnt += 1
    return cnt

def _safe_int(v, default=0):
    try:
        return int(v)
    except Exception:
        return default

@api_view(["GET"])
def admin_analytics(request):
    emp = getattr(request, "employee", None)
    if not emp or not getattr(emp, "isAdmin", False):
        return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

    try:
        employees: List[Employee] = list(Employee.objects())
        emp_ids = [str(e.id) for e in employees]
        emp_map = {str(e.id): e for e in employees}
        total_emps = len(employees)

        # Windows
        months = _month_range_endpoints(12)
        last_90_start = date.today() - timedelta(days=90)
        last_90_end = date.today()

        # Attendance in last 12 months (one query)
        min_month_start = months[0][0]
        max_month_end = months[-1][1]
        att_qs = Attendance.objects(date__gte=min_month_start, date__lte=max_month_end)

        # Index by month label
        monthly_present = defaultdict(int)
        monthly_late = defaultdict(int)

        for a in att_qs:
            label = a.date.strftime("%Y-%m")
            if a.status == "Present":
                monthly_present[label] += 1
            elif a.status == "Late":
                monthly_late[label] += 1

        # Compute monthly absent by checking missing weekdays per employee
        # For each month window, absent = totalWeekdays * totalEmployees - (present+late) (approx; ignores approved leaves)
        # Then subtract weekdays with approved leaves
        monthly_absent = {}
        # Map of (emp_id, day)->True for approved leave
        leave_qs_12m = LeaveRequeast.objects(
            status__in=["Approved", "Pending"],  # Pending still consumes future days sometimes; adjust if needed
            startDate__lte=max_month_end,
            endDate__gte=min_month_start,
        )
        leaves_days = set()
        for lr in leave_qs_12m:
            s = lr.startDate
            e = lr.endDate
            for d in _daterange(s, e):
                if d.weekday() < 5:
                    leaves_days.add((str(lr.employee.id), d))

        for (start, end, label) in months:
            weekdays = _weekday_count_in_range(start, end)
            # total available working slots
            total_slots = weekdays * total_emps
            # present+late records in this month
            recorded = monthly_present.get(label, 0) + monthly_late.get(label, 0)
            # subtract leave weekdays (each employee-day)
            leave_slots = 0
            for emp_id in emp_ids:
                for d in _daterange(start, end):
                    if d.weekday() < 5 and (emp_id, d) in leaves_days:
                        leave_slots += 1
            absent = max(0, total_slots - recorded - leave_slots)
            monthly_absent[label] = absent

        monthlyTrend = [
            {
                "month": label,
                "present": monthly_present.get(label, 0),
                "late": monthly_late.get(label, 0),
                "absent": monthly_absent.get(label, 0),
            }
            for (_, _, label) in months
        ]

        # Absenteeism Breakdown (last 90 days): Unexcused vs Leave Types
        att_last_90 = Attendance.objects(date__gte=last_90_start, date__lte=last_90_end)
        # days per employee in last 90
        total_weekdays_90 = _weekday_count_in_range(last_90_start, last_90_end)
        total_slots_90 = total_weekdays_90 * total_emps
        recorded_90 = 0
        late_count_90 = 0
        present_count_90 = 0
        for a in att_last_90:
            recorded_90 += 1
            if a.status == "Late":
                late_count_90 += 1
            elif a.status == "Present":
                present_count_90 += 1

        # Leave types in last 90
        leaves_90 = LeaveRequeast.objects(status__in=["Approved"], startDate__lte=last_90_end, endDate__gte=last_90_start)
        leave_type_count: Dict[str, int] = defaultdict(int)
        leave_slots_90 = 0
        for lr in leaves_90:
            for d in _daterange(max(lr.startDate, last_90_start), min(lr.endDate, last_90_end)):
                if d.weekday() < 5:
                    leave_slots_90 += 1
            lt = (lr.leaveType or "").capitalize()
            leave_type_count[lt] += 1

        unexcused_absences_90 = max(0, total_slots_90 - recorded_90 - leave_slots_90)
        absenteeismBreakdown = [{"label": "Unexcused Absence", "value": unexcused_absences_90}] + [
            {"label": k or "Leave", "value": v} for k, v in leave_type_count.items()
        ]

        # Leave Usage Trend by month (last 12 months, count leave requests touching month)
        leaveTrendMonthly = []
        for (start, end, label) in months:
            cnt = LeaveRequeast.objects(status__in=["Approved"], startDate__lte=end, endDate__gte=start).count()
            leaveTrendMonthly.append({"month": label, "leaves": cnt})

        # Lateness Frequency per Employee (last 90 days)
        late_by_emp: Dict[str, int] = defaultdict(int)
        for a in Attendance.objects(status="Late", date__gte=last_90_start, date__lte=last_90_end):
            emp_id = str(a.employee.id) if a.employee else None
            if emp_id:
                late_by_emp[emp_id] += 1
        latenessByEmployee = [
            {"name": f"{emp_map[eid].firstName} {emp_map[eid].lastName}".strip(), "lates": cnt}
            for eid, cnt in late_by_emp.items()
        ]

        # Radar metrics (0–100)
        # presentRate vs total slots; lateRate; leaveUsage norm; absenceRate
        present_rate = (present_count_90 := present_count_90) / total_slots_90 * 100 if total_slots_90 else 0
        late_rate = late_count_90 / total_slots_90 * 100 if total_slots_90 else 0
        absence_rate = unexcused_absences_90 / total_slots_90 * 100 if total_slots_90 else 0
        leave_usage_norm = min(100, (leave_slots_90 / total_slots_90 * 100) if total_slots_90 else 0)
        radar = [
            {"metric": "Presence", "value": round(present_rate, 1)},
            {"metric": "Lateness", "value": round(late_rate, 1)},
            {"metric": "Absences", "value": round(absence_rate, 1)},
            {"metric": "Leave Usage", "value": round(leave_usage_norm, 1)},
        ]

        # Ranking (last 90 days) — simple score
        ranking_rows = []
        for e in employees:
            # count lates
            lates = Attendance.objects(employee=e, status="Late", date__gte=last_90_start, date__lte=last_90_end).count()
            # present days
            present_days = Attendance.objects(employee=e, status="Present", date__gte=last_90_start, date__lte=last_90_end).count()
            # compute absences approx
            # weekdays last 90 - (present+late) - leave weekdays
            leave_days = 0
            for lr in LeaveRequeast.objects(employee=e, status__in=["Approved"], startDate__lte=last_90_end, endDate__gte=last_90_start):
                for d in _daterange(max(lr.startDate, last_90_start), min(lr.endDate, last_90_end)):
                    if d.weekday() < 5:
                        leave_days += 1
            absences = max(0, total_weekdays_90 - (present_days + lates) - leave_days)
            score = max(0, min(100, 100 - (lates * 2) - (absences * 5)))
            ranking_rows.append({
                "id": str(e.id),
                "name": f"{e.firstName} {e.lastName}".strip(),
                "score": score,
                "absences": absences,
                "lates": lates,
            })
        ranking_rows.sort(key=lambda x: (-_safe_int(x["score"]), _safe_int(x["absences"]), _safe_int(x["lates"])))
        for idx, r in enumerate(ranking_rows, start=1):
            r["rank"] = idx

        # Health score
        overall_score = 0
        if total_slots_90:
            penalty = (late_count_90 * 2) + (unexcused_absences_90 * 5)
            overall_score = max(0, min(100, 100 - (penalty / max(1, total_emps)) ))

        # Insights (simple prescriptive)
        insights = []
        if unexcused_absences_90 > 0:
            insights.append({
                "title": "Reduce Absenteeism",
                "detail": f"{unexcused_absences_90} unexcused absence slots detected in the last 90 days.",
                "recommendation": "Set clear attendance expectations and follow-up on trends.",
                "severity": "red",
            })
        if late_count_90 > total_emps:
            insights.append({
                "title": "Lateness Increasing",
                "detail": f"{late_count_90} late entries across employees in the last 90 days.",
                "recommendation": "Introduce grace periods and reminders; review shift start times.",
                "severity": "orange",
            })
        if leave_slots_90 > 0:
            insights.append({
                "title": "Leave Usage Healthy",
                "detail": "Employees are utilizing approved leaves.",
                "recommendation": "Ensure coverage planning and balance workloads.",
                "severity": "green",
            })
        if not insights:
            insights.append({
                "title": "Stable Attendance",
                "detail": "No significant risks detected recently.",
                "recommendation": "Maintain current policies and recognition.",
                "severity": "green",
            })

        payload = {
            "score": round(overall_score, 1),
            "insights": insights,
            "monthlyTrend": monthlyTrend,
            "absenteeismBreakdown": absenteeismBreakdown,
            "leaveUsageTrend": leaveTrendMonthly,
            "latenessByEmployee": latenessByEmployee,
            "radar": radar,
            "ranking": ranking_rows,
        }
        return Response(payload, status=status.HTTP_200_OK)
    except Exception as ex:
        return Response({"detail": f"Failed to compute analytics: {ex}"}, status=status.HTTP_400_BAD_REQUEST)