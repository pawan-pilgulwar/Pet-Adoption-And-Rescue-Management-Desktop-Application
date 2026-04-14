from django.db import models
from apps.core.constants import REPORT_STATUS_CHOICES
from apps.users.models import User
from apps.pets.models import Pet
import random
import string
import cloudinary.uploader


def generate_rescue_id():
    return 'RES-' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

class PetReport(models.Model):
    REPORT_TYPE_CHOICES = [
        ("Lost", "Lost"),
        ("Found", "Found"),
    ]

    rescue_id = models.CharField(max_length=20, unique=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports')
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='reports', null=True, blank=True)
    
    report_type = models.CharField(max_length=20, choices=REPORT_TYPE_CHOICES, default="Lost")
    location = models.CharField(max_length=200, default="")
    description = models.TextField(blank=True, null=True)
    report_status = models.CharField(max_length=20, choices=REPORT_STATUS_CHOICES, default="Pending")
    
    date_reported = models.DateTimeField(auto_now_add=True)
    admin_comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=REPORT_STATUS_CHOICES, default="Pending")
    image_url = models.URLField(blank=True, null=True)
    image_public_id = models.CharField(max_length=255, blank=True, null=True)


    def save(self, *args, **kwargs):
        if not self.rescue_id:
            self.rescue_id = generate_rescue_id()
            while PetReport.objects.filter(rescue_id=self.rescue_id).exists():
                self.rescue_id = generate_rescue_id()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.image_public_id:
            try:
                cloudinary.uploader.destroy(self.image_public_id)
            except Exception as e:
                print(f"Error deleting image from Cloudinary: {e}")
        super().delete(*args, **kwargs)

    def __str__(self):

        return f"{self.pet.name if self.pet else 'Unknown'} - {self.rescue_id}"

    class Meta:
        db_table = 'pet_report'
