import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'permission_system.settings')
django.setup()

from accounts.models import User, Function
from employees.models import Employee

def create_user(email, username, password, perms=None, is_employee=True, name=None):
    user, created = User.objects.get_or_create(email=email, defaults={'username': username})
    if created:
        user.set_password(password)
        user.save()
        print(f"User {email} created")
    else:
        print(f"User {email} already exists")
    
    if perms:
        functions = Function.objects.filter(code__in=perms)
        user.functions.set(functions)
        print(f"Permissions {perms} assigned to {email}")
    
    if is_employee:
        Employee.objects.get_or_create(
            user=user, 
            defaults={'name': name or username, 'position': 'Developer', 'salary': 50000}
        )
        print(f"Employee profile created for {email}")

if __name__ == "__main__":
    create_user(
        'admin@example.com', 'admin', 'admin123', 
        ['CREATE_EMPLOYEE', 'EDIT_EMPLOYEE', 'DELETE_EMPLOYEE', 'VIEW_EMPLOYEE', 'VIEW_SELF', 'ASSIGN_PERMISSION'], 
        name='Admin User'
    )
    create_user(
        'manager@example.com', 'manager', 'manager123', 
        ['CREATE_EMPLOYEE', 'VIEW_EMPLOYEE'], 
        name='Manager User'
    )
    create_user(
        'employee@example.com', 'employee', 'employee123', 
        ['VIEW_SELF'], 
        name='Employee User'
    )
