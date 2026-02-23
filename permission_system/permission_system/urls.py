from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.decorators import api_view, permission_classes
from django.http import JsonResponse
from rest_framework.routers import DefaultRouter
from employees.views import EmployeeViewSet
from accounts.views import AssignPermissionView, UserMeView, UserViewSet, FunctionViewSet
from accounts.permissions import HasPermission

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer

@api_view(['GET'])
@permission_classes([HasPermission])
def test_permission(request):
    test_permission.required_permission = "VIEW_EMPLOYEE"
    return JsonResponse({"message": "Permission working!"})

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet)
router.register(r'users', UserViewSet)
router.register(r'permissions', FunctionViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', EmailTokenObtainPairView.as_view(), name='login'),
    path('test-permission/', test_permission),
    path("assign-permissions/", AssignPermissionView.as_view()),
    path("accounts/me/", UserMeView.as_view()),
]
urlpatterns += router.urls