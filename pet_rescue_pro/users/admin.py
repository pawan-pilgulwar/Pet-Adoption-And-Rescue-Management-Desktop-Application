from django.contrib import admin
from .models import User
from django.contrib.auth.hashers import make_password


# Register your models here.
@admin.register(User)
class UserAdmin(admin.ModelAdmin):

    # Columns in table view
    list_display = (
        "id",
        "username",
        "email",
        "first_name",
        "last_name",
        "role",
        "phone_number",
        "created_at",
        "is_superuser",
        "is_staff",
        "is_active",
    )

    # Search bar
    search_fields = (
        "username",
        "email",
        "phone_number",
    )

    # Filter sidebar
    list_filter = (
        "role",
        "created_at",
    )

    # Default ordering
    ordering = ("-created_at",)

    # Make created_at read-only
    readonly_fields = ("created_at",)

    # Group fields in detail page
    fieldsets = (
        ("Basic Info", {
            "fields": ("username", "password")
        }),
        ("Personal Info", {
            "fields": ("first_name", "last_name", "email")
        }),
        ("Contact Info", {
            "fields": ("phone_number", "address", "profile_picture")
        }),
        ("Role & Meta", {
            "fields": ("role", "created_at")
        }),
    )

    def save_model(self, request, obj, form, change):
        # If password is not hashed yet
        if not obj.password.startswith('pbkdf2_'):
            obj.password = make_password(obj.password)

        super().save_model(request, obj, form, change)