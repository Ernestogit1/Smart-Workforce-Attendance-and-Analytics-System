from datetime import datetime, date, timedelta
from typing import Dict, Any, List
from database.models.attendance_model import Attendance
from database.models.leaveRequeast_model import LeaveRequeast
from database.models.employee_model import Employee

def _parse_month(month: str) -> (date, date):
    # month format YYYY-MM
    dt = datetime.strptime(month, "%Y-%m")
    start = date(dt.year, dt.month, 1)
    if dt.month == 12:
        end = date(dt.year + 1, 1, 1) - timedelta(days=1)
    else:
        end = date(dt.year, dt.month + 1, 1) - timedelta(days=1)
    return start, end

def _daterange(start: date, end: date) -> List[date]:
    days = []
    cur = start
    while cur <= end:
        days.append(cur)
        cur += timedelta(days=1)
    return days

def _fmt_time(dt) -> str:
    return dt.isoformat() if dt else None

def compute_employee_report(employee, month: str) -> Dict[str, Any]:
    today_local = datetime.today().date()  # use local date instead of utc to avoid off-by-one
    month_start, month_end = _parse_month(month) if month else (date(today_local.year, today_local.month, 1), date(today_local.year, today_local.month, 1))
    # If month omitted, default current month proper end
    if not month:
        if today_local.month == 12:
            month_end = date(today_local.year + 1, 1, 1) - timedelta(days=1)
        else:
            month_end = date(today_local.year, today_local.month + 1, 1) - timedelta(days=1)

    attendance_qs = Attendance.objects(employee=employee, date__gte=month_start, date__lte=month_end)
    leave_qs = LeaveRequeast.objects(employee=employee, startDate__lte=month_end, endDate__gte=month_start)

    att_map: Dict[date, Attendance] = {a.date: a for a in attendance_qs}

    leave_dates = set()
    for lr in leave_qs:
        for d in _daterange(lr.startDate, lr.endDate):
            leave_dates.add(d)

    days = _daterange(month_start, month_end)

    heatmap = []
    present_count = 0
    late_count = 0
    absent_count = 0
    time_in_accumulator_seconds = 0
    time_in_count = 0

    for d in days:
        att = att_map.get(d)
        if att:
            if att.status == "Present":
                status = "Present"
                present_count += 1
            elif att.status == "Late":
                status = "Late"
                late_count += 1
            else:
                # If a record exists but status not set, treat as Present fallback
                status = "Present"
                present_count += 1
        else:
            is_past = d < today_local or d == today_local
            is_weekday = d.weekday() < 5
            if is_past and is_weekday and d not in leave_dates:
                status = "Absent"
                absent_count += 1
            else:
                # future day or weekend or on leave
                status = "—"

        if att and att.timeIn:
            time_in_accumulator_seconds += int(att.timeIn.timestamp())
            time_in_count += 1

        heatmap.append({"date": d.isoformat(), "status": status})

    total_leave_requests = leave_qs.count()

    # Recent attendance (last 14 records)
    recent = attendance_qs.order_by("-date")[:14]
    recent_serialized = [{
        "id": str(a.id),
        "date": a.date.isoformat(),
        "status": a.status,
        "timeIn": _fmt_time(a.timeIn),
        "timeOut": _fmt_time(a.timeOut),
        "hoursWorked": a.hoursWorked,
    } for a in recent]

    # Average time-in (approx)
    avg_time_in_iso = None
    if time_in_count > 0:
        avg_epoch = time_in_accumulator_seconds / time_in_count
        avg_dt = datetime.utcfromtimestamp(avg_epoch)
        avg_time_in_iso = avg_dt.strftime("%H:%M")

    # Last month comparison
    prev_month_start = (month_start.replace(day=1) - timedelta(days=1)).replace(day=1)
    if prev_month_start.month == 12:
        prev_month_end = date(prev_month_start.year, 12, 31)
    else:
        # compute end of prev month
        nxt = date(prev_month_start.year, prev_month_start.month + 1, 1)
        prev_month_end = nxt - timedelta(days=1)

    prev_att_qs = Attendance.objects(employee=employee, date__gte=prev_month_start, date__lte=prev_month_end)
    prev_map = {a.date: a for a in prev_att_qs}
    prev_days = _daterange(prev_month_start, prev_month_end)
    prev_present = 0
    prev_late = 0
    prev_absent = 0
    for d in prev_days:
        a = prev_map.get(d)
        if a and a.status == "Present":
            prev_present += 1
        elif a and a.status == "Late":
            prev_late += 1
        else:
            if d.weekday() < 5 and d not in leave_dates and d <= today_local:
                prev_absent += 1

    comparisons = {
        "present": {"current": present_count, "previous": prev_present},
        "late": {"current": late_count, "previous": prev_late},
        "absent": {"current": absent_count, "previous": prev_absent},
    }

    # Insights
    insights = []
    if late_count > 0:
        insights.append(f"You were late {late_count} time(s) this month.")
    if absent_count > 0:
        insights.append(f"You had {absent_count} absence(s) this month.")
    if present_count > prev_present and prev_present > 0:
        improvement_pct = round(((present_count - prev_present) / prev_present) * 100, 1)
        insights.append(f"Attendance improved by {improvement_pct}% compared to last month.")
    if late_count < prev_late and prev_late > 0:
        insights.append("Late arrivals decreased compared to last month.")
    if total_leave_requests > 0:
        insights.append(f"You filed {total_leave_requests} leave request(s) overlapping this month.")

    return {
        "kpis": {
            "totalPresent": present_count,
            "totalLate": late_count,
            "totalAbsent": absent_count,
            "totalLeaveRequests": total_leave_requests,
        },
        "monthSummary": {
            "month": month_start.strftime("%Y-%m"),
            "present": present_count,
            "late": late_count,
            "absent": absent_count,
            "averageTimeIn": avg_time_in_iso,
        },
        "recentAttendance": recent_serialized,
        "heatmap": heatmap,
        "comparisons": comparisons,
        "insights": insights,
    }