from django.db import models
from apps.core.constants import PET_STATUS_CHOICES
import random
import string

def generate_pet_id():
    return 'PET-' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

class Pet(models.Model):
    pet_id = models.CharField(max_length=20, unique=True, editable=False)
    name = models.CharField(max_length=100)
    species = models.CharField(max_length=50)  # Replaced pet_type
    breed = models.CharField(max_length=50, blank=True, null=True)
    color = models.CharField(max_length=50, blank=True, null=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    gender = models.CharField(max_length=15, null=True, blank=True)
    size = models.CharField(max_length=30, null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    vaccination_status = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=20, choices=PET_STATUS_CHOICES, default="Available")
    image_url = models.URLField(blank=True, null=True)
    image_public_id = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name='pets')

    def save(self, *args, **kwargs):
        if not self.pet_id:
            self.pet_id = generate_pet_id()
            # Ensure uniqueness
            while Pet.objects.filter(pet_id=self.pet_id).exists():
                self.pet_id = generate_pet_id()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.pet_id})"

    class Meta:
        db_table = 'pet'
