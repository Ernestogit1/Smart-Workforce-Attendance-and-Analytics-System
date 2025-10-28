from typing import Any, Dict, Optional
from datetime import datetime
from mongoengine.errors import NotUniqueError, ValidationError
from database.models.employee_model import Employee

def _parse_birth_date(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None
    try:
        v = value.replace("Z", "+00:00")
        return datetime.fromisoformat(v)
    except Exception:
        try:
            return datetime.strptime(value, "%Y-%m-%d")
        except Exception:
            return None

def _to_bool(value: Any, default: bool = False) -> bool:
    if isinstance(value, bool):
        return value
    if value is None:
        return default
    if isinstance(value, (int, float)):
        return value != 0
    if isinstance(value, str):
        v = value.strip().lower()
        return v in ("true", "1", "yes", "y", "on")
    return default

def create_employee_service(payload: Dict[str, Any]) -> Employee:
    required = ["firebaseUid", "email", "firstName", "lastName"]
    missing = [f for f in required if not payload.get(f)]
    if missing:
        raise ValueError(f"Missing required fields: {', '.join(missing)}")

    middle_name = payload.get("middleName") or None
    suffixes = payload.get("suffixes") or None
    contact_number = payload.get("contactNumber") or None
    address = payload.get("address") or None
    birth_date = _parse_birth_date(payload.get("birthDate"))
    # Coerce age if it comes as string
    age_raw = payload.get("age")
    try:
        age = int(age_raw) if age_raw not in (None, "",) else None
    except Exception:
        age = None
    # Proper boolean parsing for isAdmin
    is_admin = _to_bool(payload.get("isAdmin"), default=False)
    profile_image_url = payload.get("profileImage") or None

    emp = Employee(
        lastName=payload["lastName"],
        firstName=payload["firstName"],
        middleName=middle_name,
        suffixes=suffixes,
        email=payload["email"],
        firebaseUid=payload["firebaseUid"],
        password="firebase-manage",
        contactNumber=contact_number,
        address=address,
        birthDate=birth_date,
        age=age,
        profileImage=profile_image_url,
        isAdmin=is_admin,
    )
    try:
        emp.save()
        return emp
    except NotUniqueError:
        raise ValueError("Employee with same email or firebaseUid already exists.")
    except ValidationError as e:
        raise ValueError(str(e))
    except Exception:
        raise ValueError("Failed to create employee.")