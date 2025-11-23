from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework import status
from services.leaveRequeast_services import (
    create_leave_request, list_my_leave_requests, serialize_leave,
    admin_list_pending_leaves, set_leave_status
)

@api_view(["GET", "POST"])
@parser_classes([JSONParser, FormParser, MultiPartParser])
def leave_requests(request):
    emp = getattr(request, "employee", None)
    if not emp:
        return Response({"detail": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

    if request.method == "GET":
        docs = list_my_leave_requests(emp)
        return Response([serialize_leave(d) for d in docs], status=status.HTTP_200_OK)

    data = request.data or {}
    try:
        lr = create_leave_request(emp, data)
        return Response(serialize_leave(lr), status=status.HTTP_201_CREATED)
    except ValueError as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def admin_pending_leaves(request):
    emp = getattr(request, "employee", None)
    if not emp or not getattr(emp, "isAdmin", False):
        return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
    docs = admin_list_pending_leaves()
    return Response([serialize_leave(d) for d in docs], status=status.HTTP_200_OK)

@api_view(["PATCH"])
def admin_approve_leave(request, id: str):
    emp = getattr(request, "employee", None)
    if not emp or not getattr(emp, "isAdmin", False):
        return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
    try:
        lr = set_leave_status(id, "Approved")
        return Response(serialize_leave(lr), status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PATCH"])
def admin_deny_leave(request, id: str):
    emp = getattr(request, "employee", None)
    if not emp or not getattr(emp, "isAdmin", False):
        return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
    try:
        lr = set_leave_status(id, "Rejected")
        return Response(serialize_leave(lr), status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)