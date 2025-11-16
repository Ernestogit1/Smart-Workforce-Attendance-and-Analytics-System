from typing import Dict, Any, List
from datetime import datetime, timedelta, date
from database.models.leaveRequeast_model import LeaveRequeast
from database.models.employee_model import Employee

ALLOWED_TYPES = {"sick", "vacation", "maternity", "emergency"}

def _parse_date(value: Any) -> date:
    if isinstance(value, date):
        return value
    if not value:
        raise ValueError("Missing date value")
    # Accept "YYYY-MM-DD"
    try:
        return datetime.strptime(str(value), "%Y-%m-%d").date()
    except Exception:
        # Try ISO full date-time
        try:
            return datetime.fromisoformat(str(value).replace("Z", "+00:00")).date()
        except Exception:
            raise ValueError("Invalid date format (expected YYYY-MM-DD)")

def create_leave_request(emp: Employee, payload: Dict[str, Any]) -> LeaveRequeast:
    leave_type = (payload.get("leave_type") or payload.get("leaveType") or "").strip().lower()
    if leave_type not in ALLOWED_TYPES:
        raise ValueError("Invalid leave_type. Allowed: sick, vacation, maternity, emergency.")

    start_date = _parse_date(payload.get("start_date") or payload.get("startDate"))
    end_date = _parse_date(payload.get("end_date") or payload.get("endDate"))
    reason = (payload.get("reason") or "").strip()

    today = datetime.now().date()
    earliest = today + timedelta(days=3)
    if start_date < earliest:
        raise ValueError(f"Start date must be at least 3 days from today ({earliest.isoformat()}).")
    if end_date < start_date:
        raise ValueError("End date cannot be before start date.")

    lr = LeaveRequeast(
        employee=emp,
        leaveType=leave_type,
        startDate=start_date,
        endDate=end_date,
        reason=reason or None,
        status="Pending",
    )
    lr.save()
    return lr

def list_my_leave_requests(emp: Employee) -> List[LeaveRequeast]:
    return LeaveRequeast.objects(employee=emp).order_by("-created_at")

def serialize_leave(lr: LeaveRequeast) -> Dict[str, Any]:
    return {
        "id": str(lr.id),
        "employeeId": str(lr.employee.id) if lr.employee else None,
        "leave_type": lr.leaveType,
        "start_date": lr.startDate.isoformat() if lr.startDate else None,
        "end_date": lr.endDate.isoformat() if lr.endDate else None,
        "reason": lr.reason,
        "status": lr.status,
        "created_at": lr.created_at.isoformat() if lr.created_at else None,
        "updated_at": lr.updated_at.isoformat() if lr.updated_at else None,
    }