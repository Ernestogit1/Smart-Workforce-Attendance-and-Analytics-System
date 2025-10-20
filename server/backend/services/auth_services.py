from typing import Any, Dict, Optional
from firebase_admin import auth as fb_auth
from database.models.employee_model import Employee


def verify_firebase_id_token(id_token: str) -> Dict[str, Any]:
    """
    Verify Firebase ID token and return decoded claims.
    Raises on invalid token.
    """
    decoded = fb_auth.verify_id_token(id_token)
    return decoded


def get_or_create_employee_from_firebase(decoded: Dict[str, Any]) -> Employee:
    """
    Ensure we have an Employee document for this Firebase user.
    """
    uid = decoded.get("uid") or decoded.get("user_id")
    email: Optional[str] = decoded.get("email")
    name: Optional[str] = decoded.get("name")
    picture: Optional[str] = decoded.get("picture")

    emp = Employee.objects(firebaseUid=uid).first()
    if emp:
        # Optionally sync profile image/name if needed
        if picture and not emp.profileImage:
            emp.profileImage = picture
            emp.save()
        return emp

    first = (name or "User").split(" ")[0]
    last = (name or "User").split(" ")[-1]

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
        "isAdmin": emp.isAdmin,
    }