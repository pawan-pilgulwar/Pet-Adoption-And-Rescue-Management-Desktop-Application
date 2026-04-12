from django.contrib import admin
from .models import PetReport

@admin.register(PetReport)
class PetReportAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "rescue_id",
        "pet_name",
        "user",
        "status",
        "location",
        "created_at",
    )   

    def pet_name(self, obj):
        return obj.pet.name if obj.pet else "Unknown"
    pet_name.short_description = "Pet Name"

    search_fields = (
        "rescue_id",
        "user__username",
        "location",
        "status",
    )   

    list_filter = (
        "status",
        "created_at",
    )

    readonly_fields = ("rescue_id", "created_at", "reviewed_at")
