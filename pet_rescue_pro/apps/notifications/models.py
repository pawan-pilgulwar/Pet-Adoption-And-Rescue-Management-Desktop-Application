from django.db import models
from apps.users.models import User
from apps.pets.models import Pet
from apps.rescue.models import Report
from apps.core.constants import NOTIFICATION_TYPE_CHOICES

# Create your models here.

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, null=True, blank=True)
    report = models.ForeignKey(Report, on_delete=models.CASCADE, null=True, blank=True)
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPE_CHOICES)
    title = models.CharField(max_length=100)
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"{self.title} - {self.user.email}"

    class Meta:
        db_table = "notifications"
        ordering = ["-created_at"]
