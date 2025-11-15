from functools import wraps
from django.http import JsonResponse
from services.auth_services import verify_firebase_id_token, get_or_create_employee_from_firebase

def require_firebase_auth(view_func):
    """
    Wrap a DRF @api_view with Firebase auth. On auth failure, return JsonResponse
    (not DRF Response) to avoid `.accepted_renderer` errors.
    """
    @wraps(view_func)
    def _wrapped(request, *args, **kwargs):
        if request.method == "OPTIONS":
            return JsonResponse({"ok": True})
        auth_header = request.headers.get("Authorization", "")
        parts = auth_header.split(" ")
        token = None
        if len(parts) == 2 and parts[0].lower() == "bearer":
            token = parts[1]
        elif hasattr(request, "data") and isinstance(getattr(request, "data", None), dict):
            token = request.data.get("idToken")

        if not token:
            return JsonResponse({"detail": "Authentication credentials were not provided."}, status=401)

        try:
            decoded = verify_firebase_id_token(token)
            employee = get_or_create_employee_from_firebase(decoded)
            request.firebase = decoded
            request.employee = employee
        except Exception as ex:
            print("Auth middleware rejected token:", ex)
            return JsonResponse({"detail": "Invalid or expired token."}, status=401)

        return view_func(request, *args, **kwargs)

    return _wrapped