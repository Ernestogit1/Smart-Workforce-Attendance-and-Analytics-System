from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from services.attendance_services import get_today_attendance, time_in, time_out, serialize_attendance, list_attendance
from datetime import date

@api_view(["GET"])
def today(request):
    emp = getattr(request, "employee", None)
    if not emp:
        return Response({"detail": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

    att = get_today_attendance(emp)
    return Response({"attendance": serialize_attendance(att) if att else None}, status=status.HTTP_200_OK)

@api_view(["POST"])
def time_in_view(request):
    emp = getattr(request, "employee", None)
    if not emp:
        return Response({"detail": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        att = time_in(emp)
        return Response({"attendance": serialize_attendance(att)}, status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def time_out_view(request):
    emp = getattr(request, "employee", None)
    if not emp:
        return Response({"detail": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        att = time_out(emp)
        return Response({"attendance": serialize_attendance(att)}, status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def history(request):
    emp = getattr(request, "employee", None)
    if not emp:
        return Response({"detail": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

    qp = request.query_params
    limit_str = qp.get("limit")
    start_str = qp.get("start")
    end_str = qp.get("end")

    try:
        limit = int(limit_str) if limit_str else 50
        start = date.fromisoformat(start_str) if start_str else None
        end = date.fromisoformat(end_str) if end_str else None
    except Exception:
        return Response({"detail": "Invalid query params"}, status=status.HTTP_400_BAD_REQUEST)

    items = list_attendance(emp, start=start, end=end, limit=limit)
    return Response({"items": [serialize_attendance(a) for a in items]}, status=status.HTTP_200_OK)