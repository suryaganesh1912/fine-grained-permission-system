from django.db import transaction
from rest_framework import serializers
from accounts.models import User
from employees.models import Employee


class EmployeeSerializer(serializers.ModelSerializer):
   
    email = serializers.EmailField(write_only=True, required=False)
    username = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False, style={'input_type': 'password'})
    
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Employee
        fields = ['id', 'user', 'name', 'position', 'salary', 'email', 'username', 'password', 'user_email']
        extra_kwargs = {
            'user': {'required': False}
        }

    def create(self, validated_data):
        email = validated_data.pop('email', None)
        username = validated_data.pop('username', None)
        password = validated_data.pop('password', None)
        user = validated_data.get('user', None)

        with transaction.atomic():
            if not user:
                if email and username and password:
                    # Create new user
                    user = User.objects.create_user(
                        email=email,
                        username=username,
                        password=password
                    )
                    validated_data['user'] = user
                else:
                    raise serializers.ValidationError({
                        "user": "Either a user ID or registration details (email, username, password) are required."
                    })
            
            return super().create(validated_data)