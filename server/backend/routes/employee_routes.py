from django.urls import path
from controllers.employee_controller import employees

urlpatterns = [
    path("employees", employees, name="employees"), 
]