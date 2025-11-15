from datetime import datetime, date, time
from typing import Optional, Dict, Any
from database.models.attendance_model import Attendance
from database.models.employee_model import Employee

def _today() -> date:
    return datetime.now().date()

def _classify_status(dt: datetime) -> Optional[str]:
    h = dt.hour
    if 5 <= h < 9:
        return "Present"
    if 9 <= h < 17:
        return "Late"
    return None

def _to_hms_from_seconds(total_seconds: int) -> str:
    if total_seconds < 0:
        total_seconds = 0
    h = total_seconds // 3600
    m = (total_seconds % 3600) // 60
    s = total_seconds % 60
    return f"{h:02d}:{m:02d}:{s:02d}"

def _normalize_hours_worked(value: Any) -> str:
    if isinstance(value, (int, float)):
        return _to_hms_from_seconds(int(round(float(value) * 3600)))
    if isinstance(value, str) and value:
        return value
    return "00:00:00"

def serialize_attendance(a: Attendance) -> Dict[str, Any]:
    return {
        "id": str(a.id),
        "employeeId": str(a.employee.id) if a.employee else None,
        "date": a.date.isoformat() if a.date else None,
        "timeIn": a.timeIn.isoformat() if a.timeIn else None,
        "timeOut": a.timeOut.isoformat() if a.timeOut else None,
        "status": a.status,
        "hoursWorked": _normalize_hours_worked(getattr(a, "hoursWorked", None)),
        "created_at": a.created_at.isoformat() if a.created_at else None,
        "updated_at": a.updated_at.isoformat() if a.updated_at else None,
    }

def get_today_attendance(employee: Employee) -> Optional[Attendance]:
    return Attendance.objects(employee=employee, date=_today()).first()

def time_in(employee: Employee) -> Attendance:
    now = datetime.now()
    today = _today()

    att = Attendance.objects(employee=employee, date=today).first()
    if att and att.timeIn:
        raise ValueError("Already timed in for today.")

    if not att:
        att = Attendance(employee=employee, date=today)

    att.timeIn = now
    att.status = _classify_status(now)  
    att.save()
    return att

def time_out(employee: Employee) -> Attendance:
    att = get_today_attendance(employee)
    if not att or not att.timeIn:
        raise ValueError("No time-in recorded for today.")
    if att.timeOut:
        raise ValueError("Already timed out for today.")

    now = datetime.now()
    att.timeOut = now
    delta = att.timeOut - att.timeIn
    att.hoursWorked = _to_hms_from_seconds(int(delta.total_seconds()))
    att.save()
    return att