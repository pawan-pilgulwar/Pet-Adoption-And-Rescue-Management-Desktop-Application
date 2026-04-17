from django.db import models
from apps.core.constants import USER_ROLE_CHOICES
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import AbstractUser
import cloudinary.uploader


# Create your models here.
class User(AbstractUser):
    email = models.EmailField(unique=True)
    
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    
    role = models.CharField(max_length=20, default="USER", choices=USER_ROLE_CHOICES)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "username", "password", "role"]

    def save(self, *args, **kwargs):
        if self.role == "ADMIN":
            self.is_staff = True

        super().save(*args, **kwargs)


    def delete(self, *args, **kwargs):
        # Clean up profile pictures from Cloudinary based on role
        profile = None
        if self.role == 'USER' and hasattr(self, 'user_profile'):
            profile = self.user_profile
        elif self.role == 'SHOP_OWNER' and hasattr(self, 'shop_profile'):
            profile = self.shop_profile
        
        if profile and hasattr(profile, 'profile_picture_public_id') and profile.profile_picture_public_id:
            try:
                cloudinary.uploader.destroy(profile.profile_picture_public_id)
            except Exception as e:
                print(f"Error deleting profile picture from Cloudinary: {e}")
        
        super().delete(*args, **kwargs)

    def __str__(self):
        if self.role == "SHOP_OWNER":
            return self.shop_profile.shop_name
        else:
            return self.username

    class Meta:
        db_table = 'user'


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user_profile')
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    profile_picture_url = models.URLField(blank=True, null=True)
    profile_picture_public_id = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Profile of {self.user.username}"


class ShopOwnerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='shop_profile')
    shop_name = models.CharField(max_length=255)
    shop_address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    shop_license = models.CharField(max_length=100)
    profile_picture_url = models.URLField(blank=True, null=True)
    profile_picture_public_id = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Shop Profile of {self.user.username}"


class AdminProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin_profile')
    admin_level = models.CharField(max_length=50, default="General")
    profile_picture_url = models.URLField(blank=True, null=True)
    profile_picture_public_id = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Admin Profile of {self.user.username}"


# Signals for Profile Creation
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.role == 'USER':
            UserProfile.objects.get_or_create(user=instance)
        elif instance.role == 'SHOP_OWNER':
            ShopOwnerProfile.objects.get_or_create(user=instance)
        elif instance.role == 'ADMIN':
            AdminProfile.objects.get_or_create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if instance.role == 'USER' and hasattr(instance, 'user_profile'):
        instance.user_profile.save()
    elif instance.role == 'SHOP_OWNER' and hasattr(instance, 'shop_profile'):
        instance.shop_profile.save()
    elif instance.role == 'ADMIN' and hasattr(instance, 'admin_profile'):
        instance.admin_profile.save()


