from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from middlewares.auth_middlewares import require_firebase_auth
from services.auth_services import serialize_employee


@api_view(["POST"])
@require_firebase_auth
def login(request):
    """
    Frontend already signs in with Firebase.
    This endpoint just verifies the Firebase ID token and returns the user.
    """
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.split(" ")[1] if auth_header.startswith("Bearer ") else request.data.get("idToken")
    return Response(
        {"token": token, "user": serialize_employee(request.employee)},
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
@require_firebase_auth
def me(request):
    return Response({"user": serialize_employee(request.employee)}, status=status.HTTP_200_OK)


@api_view(["POST"])
def logout(request):
    """
    For Firebase, logout is client-side. No server state to clear.
    Provided for completeness.
    """
    return Response({"ok": True}, status=status.HTTP_200_OK)
