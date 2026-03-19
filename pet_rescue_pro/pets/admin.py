from django.contrib import admin
from .models import Pet

# Register your models here.
from django.contrib import admin
from .models import Pet
from django.utils.html import format_html


@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):

    # Columns shown in admin table
    list_display = (
        "id",
        "name",
        "pet_type",
        "color",
        "breed",
        "status",
        "image_preview",
        "created_by",
        "created_at",
    )

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="50" height="50" />',
                obj.image.url
            )
        return "No Image"

    image_preview.short_description = "Image"

    # Add search bar
    search_fields = ("name", "breed", "color")

    # Add filter sidebar
    list_filter = ("pet_type", "breed", "status")

    # Order by latest
    ordering = ("-id",)