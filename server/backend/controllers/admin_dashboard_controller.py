from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from services.admin_dashboard_services import build_dashboard_summary

@api_view(["GET"])
def admin_dashboard_summary(request):
    emp = getattr(request, "employee", None)
    if not emp or not getattr(emp, "isAdmin", False):
        return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
    try:
        payload = build_dashboard_summary()
        return Response(payload, status=status.HTTP_200_OK)
    except Exception as ex:
        return Response({"detail": f"Failed to compute dashboard summary: {ex}"}, status=status.HTTP_400_BAD_REQUEST)