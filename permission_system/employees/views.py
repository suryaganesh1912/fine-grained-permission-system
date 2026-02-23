from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from accounts.permissions import HasPermission
from employees.models import Employee
from employees.serializers import EmployeeSerializer


class EmployeeViewSet(ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

    permission_map = {
        "create": "CREATE_EMPLOYEE",
        "update": "EDIT_EMPLOYEE",
        "partial_update": "EDIT_EMPLOYEE",
        "destroy": "DELETE_EMPLOYEE",
        "list": "VIEW_EMPLOYEE",
        "retrieve": "VIEW_EMPLOYEE",
        "view_self": "VIEW_SELF",
    }

    def get_permissions(self):
        self.required_permission = self.permission_map.get(self.action)
        return [HasPermission()]

    @action(detail=False, methods=["get"], url_path="me")
    def view_self(self, request):
        employee = Employee.objects.filter(user=request.user).first()
        if not employee:
            return Response({"detail": "Employee profile not found"}, status=404)

        serializer = self.get_serializer(employee)
        return Response(serializer.data)