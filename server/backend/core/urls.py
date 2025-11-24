"""
URL configuration for backend project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
]

# API routes
urlpatterns += [
    path('', include('routes.auth_routes')),
    path('', include('routes.employee_routes')),
    path('', include('routes.attendance_routes')),
    path('', include('routes.leaveRequeast_routes')),
    path('', include('routes.employeeReport_routes')),
    path('', include('routes.admin_attendance_routes')),
    path('', include('routes.admin_analytics_routes')),
    path('', include('routes.admin_dashboard_routes')),  # added
]
