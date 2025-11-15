from typing import Optional, Tuple, Dict, Any
from firebase_admin import auth as fb_auth
from .tokenMaker import verify_token as verify_local_token

def parse_auth_header(header: str) -> Optional[str]:
    if not header:
        return None
    parts = header.split()
    if len(parts) == 2 and parts[0].lower() == "bearer":
        return parts[1]
    return None

def verify_any(token: str) -> Tuple[str, Dict[str, Any]]:
    try:
        claims = fb_auth.verify_id_token(token)
        return ("firebase", claims)
    except Exception:
        claims = verify_local_token(token)
        return ("local", claims)

def verifyToken(request) -> Dict[str, Any]:
    header = request.headers.get("Authorization") or request.META.get("HTTP_AUTHORIZATION")
    raw = parse_auth_header(header)
    if not raw:
        raise ValueError("Missing Authorization Bearer token")
    source, claims = verify_any(raw)

    uid = claims.get("uid") or claims.get("user_id") or claims.get("sub")
    if uid and not claims.get("employee_id"):
        try:
            from database.models.employee_model import Employee
            emp = Employee.objects(firebaseUid=uid).first()
            if emp:
                claims["employee_id"] = str(emp.id)
        except Exception:
            pass
    return claims