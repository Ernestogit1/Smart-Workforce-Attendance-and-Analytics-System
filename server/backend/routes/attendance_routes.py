from django.urls import path
from controllers.attendace_controller import today, time_in_view, time_out_view
from middlewares.auth_middlewares import require_firebase_auth

urlpatterns = [
    path("attendance/today", require_firebase_auth(today), name="attendance_today"),
    path("attendance/time-in", require_firebase_auth(time_in_view), name="attendance_time_in"),
    path("attendance/time-out", require_firebase_auth(time_out_view), name="attendance_time_out"),
]