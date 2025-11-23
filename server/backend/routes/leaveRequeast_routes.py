from django.urls import path
from controllers.leaveRequeast_controller import leave_requests, admin_pending_leaves, admin_approve_leave, admin_deny_leave
from middlewares.auth_middlewares import require_firebase_auth

urlpatterns = [
    path("leave-requests", require_firebase_auth(leave_requests), name="leave_requests"),
    path("api/leaves/pending", require_firebase_auth(admin_pending_leaves), name="admin_pending_leaves"),
    path("api/leaves/<str:id>/approve", require_firebase_auth(admin_approve_leave), name="admin_approve_leave"),
    path("api/leaves/<str:id>/deny", require_firebase_auth(admin_deny_leave), name="admin_deny_leave"),
]