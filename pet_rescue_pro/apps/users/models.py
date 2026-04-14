from django.db import models
from apps.core.constants import USER_ROLE_CHOICES
from django.contrib.auth.models import AbstractUser
import cloudinary.uploader


# Create your models here.
class User(AbstractUser):
    email = models.EmailField(unique=True)
    
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    
    profile_picture_url = models.URLField(blank=True, null=True)
    profile_picture_public_id = models.CharField(max_length=255, blank=True, null=True)
    
    phone_number = models.CharField(max_length=15, null=True, unique=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True,)

    role = models.CharField(max_length=20, default="User", choices=USER_ROLE_CHOICES)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "username", "password", "role"]

    def save(self, *args, **kwargs):
        if self.role == "SuperAdmin":
            self.is_superuser = True
            self.is_staff = True
        elif self.role == "Admin":
            self.is_staff = True

        super().save(*args, **kwargs)


    def delete(self, *args, **kwargs):
        if self.profile_picture_public_id:
            try:
                cloudinary.uploader.destroy(self.profile_picture_public_id)
            except Exception as e:
                print(f"Error deleting profile picture from Cloudinary: {e}")
        super().delete(*args, **kwargs)

    def __str__(self):

        return self.username

    class Meta:
        db_table = 'user'


