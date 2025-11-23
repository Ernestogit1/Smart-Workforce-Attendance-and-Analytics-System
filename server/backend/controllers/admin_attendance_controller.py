from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta
from database.models.attendance_model import Attendance
from database.models.employee_model import Employee

def _parse_date(s: str):
    return datetime.strptime(s, "%Y-%m-%d").date()

@api_view(["GET"])
def admin_attendance(request):
    emp = getattr(request, "employee", None)
    if not emp or not getattr(emp, "isAdmin", False):
        return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

    qp = request.query_params
    start_str = qp.get("startDate")
    end_str = qp.get("endDate")
    include_absent = qp.get("includeAbsent") in ("1", "true", "True")

    if not start_str or not end_str:
        return Response({"detail": "Missing startDate/endDate"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        start = _parse_date(start_str)
        end = _parse_date(end_str)
    except Exception:
        return Response({"detail": "Invalid date format"}, status=status.HTTP_400_BAD_REQUEST)
    if end < start:
        return Response({"detail": "endDate before startDate"}, status=status.HTTP_400_BAD_REQUEST)

    qs = Attendance.objects(date__gte=start, date__lte=end).order_by("date")
    items = []
    for a in qs:
        emp_doc: Employee = a.employee
        full_name = f"{emp_doc.firstName} {emp_doc.lastName}".strip()
        items.append({
            "id": str(a.id),
            "employeeId": str(emp_doc.id),
            "employeeName": full_name,
            "date": a.date.isoformat(),
            "timeIn": a.timeIn.isoformat() if a.timeIn else None,
            "timeOut": a.timeOut.isoformat() if a.timeOut else None,
            "status": a.status or None,
            "hoursWorked": a.hoursWorked,
        })

    if include_absent:
        existing = {(i["employeeId"], i["date"]) for i in items}
        employees = list(Employee.objects())
        cur = start
        while cur <= end:
            if cur.weekday() < 5:
                for e in employees:
                    key = (str(e.id), cur.isoformat())
                    if key not in existing:
                        items.append({
                            "id": f"absent-{e.id}-{cur.isoformat()}",
                            "employeeId": str(e.id),
                            "employeeName": f"{e.firstName} {e.lastName}".strip(),
                            "date": cur.isoformat(),
                            "timeIn": None,
                            "timeOut": None,
                            "status": "Absent",
                            "hoursWorked": "00:00:00",
                        })
            cur += timedelta(days=1)

    return Response(items, status=status.HTTP_200_OK)