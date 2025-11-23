from django.urls import path
from controllers.admin_attendance_controller import admin_attendance
from middlewares.auth_middlewares import require_firebase_auth

urlpatterns = [
    path("api/admin/attendance", require_firebase_auth(admin_attendance)),
]