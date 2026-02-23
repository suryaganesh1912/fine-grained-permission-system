import os
import django
from rest_framework.exceptions import ValidationError

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'permission_system.settings')
django.setup()

from employees.serializers import EmployeeSerializer
from accounts.models import User
from employees.models import Employee

def test_unified_creation():
    print("\n--- Testing Unified Employee Creation ---")
    data = {
        "email": "new_test_emp@example.com",
        "username": "test_emp",
        "password": "password123",
        "name": "New Test Employee",
        "position": "Tester",
        "salary": 50000
    }
    
    serializer = EmployeeSerializer(data=data)
    if serializer.is_valid():
        emp = serializer.save()
        print(f"Success! Created Employee: {emp.name}")
        print(f"Linked User Email: {emp.user.email}")
        
        # Cleanup
        user_id = emp.user.id
        emp.delete()
        User.objects.filter(id=user_id).delete()
        print("Cleanup successful.")
    else:
        print("Validation Failed:")
        print(serializer.errors)

if __name__ == "__main__":
    test_unified_creation()
