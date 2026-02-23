import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'permission_system.settings')
django.setup()

from accounts.models import User, Function

def grant_all_permissions(email):
    try:
        user = User.objects.get(email=email)
        all_funcs = Function.objects.all()
        user.functions.set(all_funcs)
        user.save()
        print(f"Successfully granted {all_funcs.count()} permissions to {email}")
        print(f"Permissions: {[f.code for f in all_funcs]}")
    except User.DoesNotExist:
        print(f"User with email {email} not found.")

if __name__ == "__main__":
    import sys
    email = sys.argv[1] if len(sys.argv) > 1 else "suryaganesh2619@gmail.com"
    grant_all_permissions(email)
