from django.contrib import admin
from .models import AdoptionRequest

@admin.register(AdoptionRequest)
class AdoptionRequestAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "pet",
        "user",
        "status",
        "created_at",
    )
    list_filter = ("status", "created_at")
    search_fields = ("pet__name", "user__email", "user__username")
    ordering = ("-created_at",)
