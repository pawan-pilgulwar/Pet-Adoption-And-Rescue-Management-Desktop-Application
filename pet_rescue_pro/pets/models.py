from django.db import models
from core.constants import PET_STATUS_CHOICES
from django.conf import settings

# Create your models here.
class Pet(models.Model):
    name = models.CharField(max_length=100)
    pet_type = models.CharField(max_length=50)
    breed = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=PET_STATUS_CHOICES)
    location = models.CharField(max_length=200)
    image = models.ImageField(upload_to="pets/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name='pets')

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'pet'