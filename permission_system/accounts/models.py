from django.contrib.auth.models import AbstractUser
from django.db import models

class Function(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField()

    def __str__(self):
        return self.code


class User(AbstractUser):
    email = models.EmailField(unique=True)
    functions = models.ManyToManyField(Function, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']