from django.contrib import admin
from .models import User, UserProfile, ShopOwnerProfile, AdminProfile
from django.utils.html import format_html
from django.contrib.auth.hashers import make_password



class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'User Profile'

class ShopOwnerProfileInline(admin.StackedInline):
    model = ShopOwnerProfile
    can_delete = False
    verbose_name_plural = 'Shop Owner Profile'

class AdminProfileInline(admin.StackedInline):
    model = AdminProfile
    can_delete = False
    verbose_name_plural = 'Admin Profile'

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
        "created_at",
        "is_superuser",
        "is_staff",
        "is_active",
    )

    # Search bar
    search_fields = (
        "username",
        "email",
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
        ("Role & Meta", {
            "fields": ("role", "created_at")
        }),
    )

    inlines = [UserProfileInline, ShopOwnerProfileInline, AdminProfileInline]

    def image_preview(self, obj):
        if obj.profile_picture_url:
            return format_html(
                '<img src="{}" width="50" height="50" style="border-radius: 50%;" />',
                obj.profile_picture_url
            )
        return "No Image"

    def save_model(self, request, obj, form, change):
        # If password is not hashed yet
        if not obj.password.startswith('pbkdf2_'):
            obj.password = make_password(obj.password)

        super().save_model(request, obj, form, change)
