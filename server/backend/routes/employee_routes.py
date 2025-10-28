from django.urls import path
from controllers.employee_controller import employees, employee_detail
from middlewares.auth_middlewares import require_firebase_auth

urlpatterns = [
    path("employees", require_firebase_auth(employees), name="employees"),
    path("employees/<str:emp_id>", require_firebase_auth(employee_detail), name="employee_detail"),
]