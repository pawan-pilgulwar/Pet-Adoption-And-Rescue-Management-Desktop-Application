from django.db import models
from apps.users.models import User
from apps.pets.models import Pet
from apps.core.constants import ADOPTION_STATUS_CHOICES, ADOPTION_REQUEST_STATUS_CHOICES

class AdoptionListing(models.Model):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='listings')
    shop_owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pet_listings')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Listing for {self.pet.name} by {self.shop_owner.username}"

    class Meta:
        db_table = 'adoption_listing'

class AdoptionRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='adoption_requests')
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='adoption_requests')
    listing = models.ForeignKey(AdoptionListing, on_delete=models.CASCADE, related_name='requests', null=True, blank=True)
    status = models.CharField(max_length=20, choices=ADOPTION_REQUEST_STATUS_CHOICES, default="Pending")
    request_details = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Request for {self.pet.name} by {self.user.username}"

    class Meta:
        db_table = 'adoption_request'

class Adoption(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='adoptions')
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='adoptions')
    shop_owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shop_adoptions')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, choices=ADOPTION_STATUS_CHOICES, default="Pending")
    adopted_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Adoption of {self.pet.name} by {self.user.username}"

    class Meta:
        db_table = 'adoption'
