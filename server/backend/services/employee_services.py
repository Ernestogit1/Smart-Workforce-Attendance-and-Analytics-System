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
    age = payload.get("age")
    is_admin = bool(payload.get("isAdmin", False))

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
        profileImage=None,  
        isAdmin=is_admin,
    )
    try:
        emp.save()
        return emp
    except NotUniqueError as e:
        raise ValueError("Employee with same email or firebaseUid already exists.")
    except ValidationError as e:
        raise ValueError(str(e))
    except Exception as e:
        raise ValueError("Failed to create employee.")