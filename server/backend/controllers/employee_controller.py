from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from middlewares.auth_middlewares import require_firebase_auth
from services.employee_services import create_employee_service
from database.models.employee_model import Employee

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
        "isAdmin": bool(emp.isAdmin),
        "created_at": emp.created_at.isoformat() if emp.created_at else None,
        "updated_at": emp.updated_at.isoformat() if emp.updated_at else None,
    }

@api_view(["GET", "POST"])
@require_firebase_auth
def employees(request):
    # Only admins can list/create employees
    if not getattr(request, "employee", None) or not getattr(request.employee, "isAdmin", False):
        return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        docs = Employee.objects.order_by("-created_at")
        data = [serialize_employee_full(emp) for emp in docs]
        return Response(data, status=status.HTTP_200_OK)

    # POST create
    data = request.data or {}
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
        })
        return Response(serialize_employee_full(emp), status=status.HTTP_201_CREATED)
    except ValueError as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)