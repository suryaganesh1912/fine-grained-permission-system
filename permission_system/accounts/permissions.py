from rest_framework.permissions import BasePermission

class HasPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        required_permission = getattr(view, "required_permission", None)

        # If no permission required → allow
        if not required_permission:
            return True

        # System stability: Always allow users to see their own profile
        if required_permission == "VIEW_SELF":
            return True

        return request.user.functions.filter(code=required_permission).exists()