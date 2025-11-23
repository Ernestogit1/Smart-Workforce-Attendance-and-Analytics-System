from django.urls import path
from controllers.admin_analytics_controller import admin_analytics
from middlewares.auth_middlewares import require_firebase_auth

urlpatterns = [
    path("api/admin/analytics", require_firebase_auth(admin_analytics), name="admin_analytics"),
]