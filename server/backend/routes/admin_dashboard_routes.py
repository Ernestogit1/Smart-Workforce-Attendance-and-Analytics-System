from django.urls import path
from controllers.admin_dashboard_controller import admin_dashboard_summary
from middlewares.auth_middlewares import require_firebase_auth

urlpatterns = [
    path("api/admin/dashboard-summary", require_firebase_auth(admin_dashboard_summary), name="admin_dashboard_summary"),
]