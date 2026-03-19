from django.db import models
from core.constants import USER_ROLE_CHOICES

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=100, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    profile_picture = models.ImageField(upload_to="profiles/", null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, unique=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True,)
    created_at = models.DateTimeField(auto_now_add=True)
    role = models.CharField(max_length=20, default="User", choices=USER_ROLE_CHOICES)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.username

    class Meta:
        db_table = 'user'


