from django.contrib import admin
from .models import Pet
from django.utils.html import format_html

@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "pet_id",
        "name",
        "species",
        "color",
        "breed",
        "image_preview",
        "created_by",
        "created_at",
    )

    def image_preview(self, obj):
        if obj.image_url:
            return format_html(
                '<img src="{}" width="50" height="50" style="border-radius: 50%;" />',
                obj.image_url
            )
        return "No Image"

    image_preview.short_description = "Image"

    search_fields = ("pet_id", "name", "breed", "color")
    list_filter = ("species", "breed")
    ordering = ("-id",)
    readonly_fields = ("pet_id", "created_at", "updated_at")
