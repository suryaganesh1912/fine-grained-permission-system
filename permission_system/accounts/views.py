from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from accounts.models import User, Function
from accounts.serializers import AssignPermissionSerializer, UserSerializer, FunctionSerializer
from accounts.permissions import HasPermission


class AssignPermissionView(APIView):
    permission_classes = [HasPermission]
    required_permission = "ASSIGN_PERMISSION"

    def post(self, request):
        serializer = AssignPermissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_id = serializer.validated_data["user_id"]
        permission_codes = serializer.validated_data["permissions"]

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        permissions = Function.objects.filter(code__in=permission_codes)
        user.functions.set(permissions)
        user.save()

        return Response({"message": "Permissions updated successfully"})


class UserMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


from rest_framework.viewsets import ReadOnlyModelViewSet

class UserViewSet(ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class FunctionViewSet(ReadOnlyModelViewSet):
    queryset = Function.objects.all()
    serializer_class = FunctionSerializer
    permission_classes = [IsAuthenticated]