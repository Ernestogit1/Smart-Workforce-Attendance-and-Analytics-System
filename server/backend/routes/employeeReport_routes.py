from django.urls import path
from controllers.employeeReport_controller import employee_report
from middlewares.auth_middlewares import require_firebase_auth

urlpatterns = [
    path("reports/employee", require_firebase_auth(employee_report), name="employee_report"),
]