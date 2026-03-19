from django.db import models
from core.constants import REPORT_STATUS_CHOICES
from users.models import User


class PetReport(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports')
    pet_name = models.CharField(max_length=100)
    pet_type = models.CharField(max_length=50)
    pet_breed = models.CharField(max_length=50, blank=True, null=True)
    pet_color = models.CharField(max_length=50, blank=True, null=True)
    pet_image = models.ImageField(upload_to='pet_report_images/', blank=True, null=True)
    pet_status = models.CharField(max_length=20, choices=[("Lost", "Lost"), ("Found", "Found")], default="Lost")
    location = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    admin_comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=REPORT_STATUS_CHOICES, default="Pending")

    def __str__(self):
        return f"{self.pet_name} - {self.status}"

    class Meta:
        db_table = 'pet_report'
