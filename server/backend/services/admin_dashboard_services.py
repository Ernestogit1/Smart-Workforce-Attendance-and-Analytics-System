from datetime import date, timedelta
from collections import defaultdict
from typing import Dict, Any, List
from database.models.employee_model import Employee
from database.models.attendance_model import Attendance
from database.models.leaveRequeast_model import LeaveRequeast

def _daterange(d0: date, d1: date):
    cur = d0
    while cur <= d1:
        yield cur
        cur += timedelta(days=1)

def build_dashboard_summary() -> Dict[str, Any]:
    today = date.today()
    employees_count = Employee.objects.count()

    present_today = Attendance.objects(date=today, status="Present").count()
    late_today = Attendance.objects(date=today, status="Late").count()

    leaves_today = LeaveRequeast.objects(status="Approved", startDate__lte=today, endDate__gte=today)
    leave_emp_ids_today = {str(lr.employee.id) for lr in leaves_today if lr.employee}
    approved_leaves_today = len(leave_emp_ids_today)

    recorded_today = present_today + late_today
    absent_today = max(0, employees_count - recorded_today - approved_leaves_today)

    pending_leaves = LeaveRequeast.objects(status="Pending").count()

    # 7-day trend
    start7 = today - timedelta(days=6)
    trend7_map: Dict[str, Dict[str, int]] = defaultdict(lambda: {"present": 0, "late": 0})
    att7 = Attendance.objects(date__gte=start7, date__lte=today)
    for a in att7:
        label = a.date.isoformat()
        if a.status == "Present":
            trend7_map[label]["present"] += 1
        elif a.status == "Late":
            trend7_map[label]["late"] += 1

    leaves7 = LeaveRequeast.objects(status="Approved", startDate__lte=today, endDate__gte=start7)
    leaves7_days = set()
    for lr in leaves7:
        s = max(lr.startDate, start7)
        e = min(lr.endDate, today)
        for d in _daterange(s, e):
            if d.weekday() < 5 and lr.employee:
                leaves7_days.add((str(lr.employee.id), d))

    trend7 = []
    for d in _daterange(start7, today):
        label = d.isoformat()
        present = trend7_map[label]["present"]
        late = trend7_map[label]["late"]
        leave_emps_day = {eid for (eid, dd) in leaves7_days if dd == d}
        leave_slots = len(leave_emps_day)
        if d.weekday() < 5:
            absent = max(0, employees_count - (present + late) - leave_slots)
        else:
            absent = 0
        trend7.append({"date": label, "present": present, "late": late, "absent": absent})

    # Top lates 30 days
    start30 = today - timedelta(days=30)
    late30 = Attendance.objects(status="Late", date__gte=start30, date__lte=today)
    late_by_emp: Dict[str, int] = defaultdict(int)
    for a in late30:
        if a.employee:
            late_by_emp[str(a.employee.id)] += 1
    emp_map = {str(e.id): e for e in Employee.objects()}
    top_lates_30 = sorted(
        [{"name": f"{emp_map[eid].firstName} {emp_map[eid].lastName}".strip(), "lates": cnt}
         for eid, cnt in late_by_emp.items()],
        key=lambda x: -x["lates"]
    )[:8]

    recent_leaves = LeaveRequeast.objects().order_by("-created_at")[:8]
    recent = [{
        "id": str(lr.id),
        "employeeName": f"{lr.employee.firstName} {lr.employee.lastName}".strip() if lr.employee else None,
        "leaveType": lr.leaveType,
        "startDate": lr.startDate.isoformat() if lr.startDate else None,
        "endDate": lr.endDate.isoformat() if lr.endDate else None,
        "status": lr.status,
        "createdAt": lr.created_at.isoformat() if lr.created_at else None,
    } for lr in recent_leaves]

    return {
        "totals": {
            "employees": employees_count,
            "presentToday": present_today,
            "lateToday": late_today,
            "absentToday": absent_today,
            "pendingLeaves": pending_leaves,
            "approvedLeavesToday": approved_leaves_today,
        },
        "trend7": trend7,
        "topLates30": top_lates_30,
        "recentLeaves": recent,
    }