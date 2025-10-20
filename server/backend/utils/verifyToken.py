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
    """
    Try verifying as Firebase ID token first, then fallback to local JWT.
    Returns: (source, claims) where source in {"firebase", "local"}.
    """
    try:
        claims = fb_auth.verify_id_token(token)
        return ("firebase", claims)
    except Exception:
        claims = verify_local_token(token)
        return ("local", claims)