from django.db.models.signals import post_migrate
from django.dispatch import receiver
from accounts.models import Function


@receiver(post_migrate)
def create_default_permissions(sender, **kwargs):
    required_functions = [
        {
            "name": "Create Employee",
            "code": "CREATE_EMPLOYEE",
            "description": "Can create employees"
        },
        {
            "name": "Edit Employee",
            "code": "EDIT_EMPLOYEE",
            "description": "Can edit employees"
        },
        {
            "name": "Delete Employee",
            "code": "DELETE_EMPLOYEE",
            "description": "Can delete employees"
        },
        {
            "name": "View Employee",
            "code": "VIEW_EMPLOYEE",
            "description": "Can view employee list"
        },
        {
            "name": "View Self",
            "code": "VIEW_SELF",
            "description": "Can view own profile"
        },
        {
            "name": "Assign Permission",
            "code": "ASSIGN_PERMISSION",
            "description": "Can assign or revoke permissions"
        },
    ]

    for func in required_functions:
        Function.objects.get_or_create(
            code=func["code"],
            defaults={
                "name": func["name"],
                "description": func["description"]
            }
        )