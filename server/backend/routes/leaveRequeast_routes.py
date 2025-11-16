from django.urls import path
from controllers.leaveRequeast_controller import leave_requests
from middlewares.auth_middlewares import require_firebase_auth

urlpatterns = [
    path("leave-requests", require_firebase_auth(leave_requests), name="leave_requests"),
]