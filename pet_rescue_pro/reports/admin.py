from django.contrib import admin
from .models import PetReport

# Register your models here.

@admin.register(PetReport)
class PetReportAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "pet_name",
        "pet_type",
        "pet_breed",
        "pet_color",
        "pet_image",
        "pet_status",
        "user",
        "status",
        "location",
        "created_at",
    )   

    search_fields = (
        "pet_name",
        "user__username",
        "pet_status",
        "location",
        "status",
    )   

    list_filter = (
        "status",
        "created_at",
        "pet_status"
    )

    readonly_fields = ("created_at", "reviewed_at")
