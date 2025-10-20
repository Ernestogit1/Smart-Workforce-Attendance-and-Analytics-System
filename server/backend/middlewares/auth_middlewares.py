from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from services.auth_services import verify_firebase_id_token, get_or_create_employee_from_firebase


def require_firebase_auth(view_func):
    """
    Decorator that verifies Firebase ID token from Authorization: Bearer <token>
    or from request.data.idToken, then attaches request.firebase and request.employee.
    """
    @wraps(view_func)
    def _wrapped(request, *args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        parts = auth_header.split(" ")
        token = parts[1] if len(parts) == 2 and parts[0].lower() == "bearer" else None
        if not token and hasattr(request, "data") and isinstance(request.data, dict):
            token = request.data.get("idToken")

        if not token:
            return Response({"detail": "Authentication credentials were not provided."},
                            status=status.HTTP_401_UNAUTHORIZED)
        try:
            decoded = verify_firebase_id_token(token)
            employee = get_or_create_employee_from_firebase(decoded)
            request.firebase = decoded
            request.employee = employee
            return view_func(request, *args, **kwargs)
        except Exception as ex:
            print("Auth middleware rejected token:", ex)
            return Response({"detail": "Invalid or expired token."},
                            status=status.HTTP_401_UNAUTHORIZED)
    return _wrapped