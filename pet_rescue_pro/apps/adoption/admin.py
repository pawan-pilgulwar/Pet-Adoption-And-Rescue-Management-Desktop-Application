from django.contrib import admin
from .models import Adoption, AdoptionListing

@admin.register(AdoptionListing)
class AdoptionListingAdmin(admin.ModelAdmin):
    list_display = ('id', 'pet', 'shop_owner', 'price', 'description', 'is_available', 'created_at')
    list_filter = ('is_available', 'created_at')
    search_fields = ('pet__name', 'shop_owner__username', 'description')

@admin.register(Adoption)
class AdoptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'pet', 'user', 'shop_owner', 'price', 'adopted_at')
    list_filter = ('adopted_at',)
    search_fields = ('pet__name', 'user__username', 'shop_owner__username')
