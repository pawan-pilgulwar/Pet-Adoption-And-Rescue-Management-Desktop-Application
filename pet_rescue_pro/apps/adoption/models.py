from django.db import models
from apps.users.models import User
from apps.pets.models import Pet
from apps.core.constants import ADOPTION_REQUEST_STATUS_CHOICES

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

class Adoption(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='adoptions')
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='adoptions')
    shop_owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shop_adoptions')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    adopted_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Adoption of {self.pet.name} by {self.user.username}"

    class Meta:
        db_table = 'adoption'
