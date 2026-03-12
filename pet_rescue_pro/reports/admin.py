from django.contrib import admin
from .models import PetReport

# Register your models here.
admin.site.register(PetReport)

@admin.register(PetReport)
class PetReportAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "pet_detail",
        "admin_comment",
        "report_status",
        "reviewed_by",
        "created_at",
        "reviewed_at",
        "reviewed_by_detail"
    )   

    search_fields = (
        "pet_detail",
        "report_status",
        "reviewed_by",
        "created_at",
        "reviewed_at"
    )   

    fieldsets = (
        ("Basic Info", {
            "fields": ("pet_detail", "admin_comment", "report_status", "reviewed_by", "created_at", "reviewed_at", "reviewed_by_detail")
        })
    )

