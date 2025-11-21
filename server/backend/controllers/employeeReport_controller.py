from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from services.employeeReport_services import compute_employee_report

@api_view(["GET"])
def employee_report(request):
    emp = getattr(request, "employee", None)
    if not emp:
        return Response({"detail": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
    month = request.query_params.get("month")  # YYYY-MM
    try:
        data = compute_employee_report(emp, month)  # month may be None
    except Exception as ex:
        return Response({"detail": f"Failed to compute report: {ex}"}, status=status.HTTP_400_BAD_REQUEST)
    return Response(data, status=status.HTTP_200_OK)