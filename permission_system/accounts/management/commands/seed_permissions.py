from django.core.management.base import BaseCommand
from accounts.models import Function

class Command(BaseCommand):
    help = 'Seed initial functions/permissions'

    def handle(self, *args, **kwargs):
        functions = [
            {'code': 'CREATE_EMPLOYEE', 'name': 'Create Employee', 'description': 'Allows creating new employees'},
            {'code': 'EDIT_EMPLOYEE', 'name': 'Edit Employee', 'description': 'Allows editing existing employees'},
            {'code': 'DELETE_EMPLOYEE', 'name': 'Delete Employee', 'description': 'Allows deleting employees'},
            {'code': 'VIEW_EMPLOYEE', 'name': 'View Employee', 'description': 'Allows viewing the list and details of all employees'},
            {'code': 'VIEW_SELF', 'name': 'View Self', 'description': 'Allows viewing only self employee record'},
            {'code': 'ASSIGN_PERMISSION', 'name': 'Assign Permission', 'description': 'Allows assigning permissions to other users'},
        ]

        for func_data in functions:
            obj, created = Function.objects.get_or_create(
                code=func_data['code'],
                defaults={
                    'name': func_data['name'],
                    'description': func_data['description']
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Successfully created function: {func_data['code']}"))
            else:
                self.stdout.write(self.style.WARNING(f"Function already exists: {func_data['code']}"))
