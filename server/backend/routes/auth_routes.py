from django.urls import path
from controllers.auth_controller import login, me, logout
from middlewares.auth_middlewares import require_firebase_auth

urlpatterns = [
    # Apply the auth decorator at routing level (Express-style)
    path("auth/login", require_firebase_auth(login), name="auth_login"),
    path("auth/me", require_firebase_auth(me), name="auth_me"),
    path("auth/logout", require_firebase_auth(logout), name="auth_logout"),
]