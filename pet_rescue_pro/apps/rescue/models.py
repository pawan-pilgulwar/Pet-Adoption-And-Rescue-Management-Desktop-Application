from django.db import models
from apps.users.models import User
from apps.reports.models import PetReport
from apps.core.constants import RESCUE_STATUS_CHOICES

class RescueRequest(models.Model):
    report = models.ForeignKey(PetReport, on_delete=models.CASCADE, related_name='rescue_requests')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rescue_requests')
    status = models.CharField(max_length=20, choices=RESCUE_STATUS_CHOICES, default="Pending")
    request_details = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Rescue Request for {self.report.pet.name} by {self.user.username}"

    class Meta:
        db_table = 'rescue_request'
