from django.urls import path
from controllers.auth_controller import login, me, logout

urlpatterns = [
    path("auth/login", login, name="auth_login"),
    path("auth/me", me, name="auth_me"),
    path("auth/logout", logout, name="auth_logout"),
]