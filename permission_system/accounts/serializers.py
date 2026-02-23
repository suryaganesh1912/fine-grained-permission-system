from rest_framework import serializers
from accounts.models import User, Function


class FunctionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Function
        fields = ['id', 'name', 'code', 'description']


class UserSerializer(serializers.ModelSerializer):
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'permissions']

    def get_permissions(self, obj):
        return list(obj.functions.values_list('code', flat=True))


class AssignPermissionSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    permissions = serializers.ListField(
        child=serializers.CharField()
    )