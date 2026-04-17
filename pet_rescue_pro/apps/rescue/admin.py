from django.contrib import admin
from .models import Report, RescueRequest

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "rescue_id",
        "pet_name",
        "user",
        "report_type",
        "is_verified",
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
        "report_type",
        "is_verified",
        "status",
        "created_at",
    )

    readonly_fields = ("rescue_id", "created_at", "updated_at")

@admin.register(RescueRequest)
class RescueRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'report', 'user', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('report__rescue_id', 'user__username')
