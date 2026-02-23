from django.db import models
from django.conf import settings


class Employee(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="employee_profile"
    )
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    salary = models.IntegerField()

    def __str__(self):
        return self.name