from django.contrib import admin
from .models import RescueRequest

@admin.register(RescueRequest)
class RescueRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'report', 'user', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at', 'updated_at')
    search_fields = ('report__rescue_id', 'user__username', 'user__email', 'user__phone_number', 'user__address')
    ordering = ('-created_at',)


