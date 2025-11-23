from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from services.auth_services import serialize_employee


@api_view(["POST"])
def login(request):
    """
    Frontend signs in with Firebase; require_firebase_auth is applied in routes.
    """
    if not getattr(request, "employee", None):
        return Response({"detail": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

    # Block restricted users
    if getattr(request.employee, "isRestricted", False):
        return Response({"detail": "Account is restricted. Please contact the administrator."},
                        status=status.HTTP_403_FORBIDDEN)

    auth_header = request.headers.get("Authorization", "")
    token = auth_header.split(" ")[1] if auth_header.startswith("Bearer ") else request.data.get("idToken")
    return Response({"token": token, "user": serialize_employee(request.employee)}, status=status.HTTP_200_OK)


@api_view(["GET"])
def me(request):
    if not getattr(request, "employee", None):
        return Response({"detail": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

    # Optional: also block restricted from using the app if token is present
    if getattr(request.employee, "isRestricted", False):
        return Response({"detail": "Account is restricted. Please contact the administrator."},
                        status=status.HTTP_403_FORBIDDEN)

    return Response({"user": serialize_employee(request.employee)}, status=status.HTTP_200_OK)


@api_view(["POST"])
def logout(request):
    """
    For Firebase, logout is client-side.
    """
    return Response({"ok": True}, status=status.HTTP_200_OK)
