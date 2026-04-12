from django.db import models
from apps.pets.models import Pet
from apps.users.models import User
from apps.core.constants import ADOPTION_STATUS_CHOICES

class AdoptionRequest(models.Model):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='adoption_requests')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='adoption_requests')
    status = models.CharField(max_length=20, choices=ADOPTION_STATUS_CHOICES, default="Pending")
    request_details = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Adoption Request for {self.pet.name} by {self.user.username}"

    class Meta:
        db_table = 'adoption_request'
