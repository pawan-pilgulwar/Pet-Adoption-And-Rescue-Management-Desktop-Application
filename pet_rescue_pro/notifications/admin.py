from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'is_read', 'created_at', 'pet', 'report')
    list_filter = ('is_read', 'created_at')
    search_fields = ('user__username', 'title', 'message', 'pet__name', 'report__title')
    readonly_fields = ('created_at', 'is_read', 'notification_type', 'user', 'pet', 'report')
