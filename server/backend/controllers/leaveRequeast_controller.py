from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework import status
from services.leaveRequeast_services import create_leave_request, list_my_leave_requests, serialize_leave

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