from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework import status
from mongoengine.errors import ValidationError  # added
from services.employee_services import _to_bool, _parse_birth_date, create_employee_service  # added
from config.cloudinary_config import upload_profile_image
from database.models.employee_model import Employee
from firebase_admin import auth as fb_auth  # add this import

def serialize_employee_full(emp):
    return {
        "_id": str(emp.id),
        "firebaseUid": emp.firebaseUid,
        "email": emp.email,
        "lastName": emp.lastName,
        "firstName": emp.firstName,
        "middleName": emp.middleName,
        "suffixes": emp.suffixes,
        "contactNumber": emp.contactNumber,
        "address": emp.address,
        "birthDate": emp.birthDate.isoformat() if emp.birthDate else None,
        "age": emp.age,
        "profileImage": emp.profileImage,
        "isRestricted": bool(emp.isRestricted),  # added
        "isAdmin": bool(emp.isAdmin),
        "created_at": emp.created_at.isoformat() if emp.created_at else None,
        "updated_at": emp.updated_at.isoformat() if emp.updated_at else None,
    }

@api_view(["GET", "POST"])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def employees(request):
    # Only admins can list/create employees
    if not getattr(request, "employee", None) or not getattr(request.employee, "isAdmin", False):
        return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        docs = Employee.objects.order_by("-created_at")
        data = [serialize_employee_full(emp) for emp in docs]
        return Response(data, status=status.HTTP_200_OK)

    # POST: handle optional profile image upload
    data = request.data or {}
    file = request.FILES.get("profileImage")
    profile_url = None
    if file:
        try:
            profile_url, _ = upload_profile_image(file, folder="employees")
        except Exception:
            return Response({"detail": "Failed to upload profile image."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        emp = create_employee_service({
            "firebaseUid": data.get("firebaseUid"),
            "email": data.get("email"),
            "firstName": data.get("firstName"),
            "lastName": data.get("lastName"),
            "middleName": data.get("middleName"),
            "suffixes": data.get("suffixes"),
            "contactNumber": data.get("contactNumber"),
            "address": data.get("address"),
            "birthDate": data.get("birthDate"),
            "age": data.get("age"),
            "isAdmin": data.get("isAdmin", False),
            "profileImage": profile_url,  # store Cloudinary URL (or None)
        })
        return Response(serialize_employee_full(emp), status=status.HTTP_201_CREATED)
    except ValueError as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET", "PATCH"])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def employee_detail(request, emp_id: str):
    if not getattr(request, "employee", None) or not getattr(request.employee, "isAdmin", False):
        return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

    emp = Employee.objects(id=emp_id).first()
    if not emp:
        return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        return Response(serialize_employee_full(emp), status=status.HTTP_200_OK)

    data = request.data or {}

    # 1) Apply Firebase updates first (email/password)
    firebase_updates = {}
    incoming_email = data.get("email")
    if incoming_email and incoming_email != emp.email:
        firebase_updates["email"] = incoming_email

    new_password = data.get("password") or data.get("newPassword")
    if new_password:
        firebase_updates["password"] = new_password

    if firebase_updates:
        try:
            fb_auth.update_user(emp.firebaseUid, **firebase_updates)
        except Exception as ex:
            return Response({"detail": f"Failed to update Firebase user: {ex}"}, status=status.HTTP_400_BAD_REQUEST)
        # Reflect changes in Mongo
        if "email" in firebase_updates:
            emp.email = firebase_updates["email"]
        # Never store real password in Mongo
        emp.password = "firebase-manage"

    # 2) Optional: profile image upload
    file = request.FILES.get("profileImage")
    if file:
        try:
            url, _ = upload_profile_image(file, folder="employees")
            if url:
                emp.profileImage = url
        except Exception:
            return Response({"detail": "Failed to upload profile image."}, status=status.HTTP_400_BAD_REQUEST)

    # 3) Patch other fields (skip direct email override; already handled above)
    if "lastName" in data: emp.lastName = data.get("lastName") or emp.lastName
    if "firstName" in data: emp.firstName = data.get("firstName") or emp.firstName
    if "middleName" in data: emp.middleName = data.get("middleName") or None
    if "suffixes" in data: emp.suffixes = data.get("suffixes") or None
    if "contactNumber" in data: emp.contactNumber = data.get("contactNumber") or None
    if "address" in data: emp.address = data.get("address") or None
    if "birthDate" in data: emp.birthDate = _parse_birth_date(data.get("birthDate"))
    if "age" in data:
      try:
        emp.age = int(data.get("age")) if data.get("age") not in (None, "",) else None
      except Exception:
        emp.age = None
    if "isAdmin" in data:
        emp.isAdmin = _to_bool(data.get("isAdmin"), default=emp.isAdmin)
    if "isRestricted" in data:  # added
        emp.isRestricted = _to_bool(data.get("isRestricted"), default=emp.isRestricted)

    try:
        emp.save()
        return Response(serialize_employee_full(emp), status=status.HTTP_200_OK)
    except ValidationError as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception:
        return Response({"detail": "Failed to update"}, status=status.HTTP_400_BAD_REQUEST)