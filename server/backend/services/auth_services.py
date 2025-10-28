from typing import Any, Dict, Optional
from firebase_admin import auth as fb_auth
from database.models.employee_model import Employee


def verify_firebase_id_token(id_token: str) -> Dict[str, Any]:
    """
    Verify Firebase ID token and return decoded claims. Raises on invalid/expired token.
    """
    return fb_auth.verify_id_token(id_token)


def get_or_create_employee_from_firebase(decoded: Dict[str, Any]) -> Employee:
    """
    Ensure we have an Employee document for this Firebase user. Syncs basic profile fields.
    """
    uid = decoded.get("uid") or decoded.get("user_id")
    email: Optional[str] = decoded.get("email")
    name: Optional[str] = decoded.get("name")
    picture: Optional[str] = decoded.get("picture")

    if not uid:
        raise ValueError("Missing uid in Firebase token")

    emp = Employee.objects(firebaseUid=uid).first()
    if emp:
        # Optionally sync name/email/photo if changed
        if email and emp.email != email:
            emp.email = email
        if picture and emp.profileImage != picture:
            emp.profileImage = picture
        if name:
            parts = name.split()
            first = parts[0] if parts else emp.firstName
            last = parts[-1] if parts else emp.lastName
            if first and emp.firstName != first:
                emp.firstName = first
            if last and emp.lastName != last:
                emp.lastName = last
        emp.save()
        return emp

    parts = (name or "User").split()
    first = parts[0] if parts else "User"
    last = parts[-1] if parts else "User"

    emp = Employee(
        lastName=last or "User",
        firstName=first or "User",
        middleName=None,
        suffixes=None,
        email=email,
        firebaseUid=uid,
        password="firebase-manage",
        address="",
        birthDate=None,
        age=None,
        profileImage=picture,
        isAdmin=False,
    )
    emp.save()
    return emp


def serialize_employee(emp: Employee) -> Dict[str, Any]:
    return {
        "id": str(emp.id),
        "uid": emp.firebaseUid,
        "email": emp.email,
        "firstName": emp.firstName,
        "lastName": emp.lastName,
        "photoURL": emp.profileImage,
        "isAdmin": bool(emp.isAdmin),
    }