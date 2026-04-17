from django.contrib import admin
from .models import Service, Booking

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "price",
        "created_at",
        "updated_at",
    )

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "service",
        "booking_date",
        "status",
        "created_at",
        "updated_at",
    )

@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "service",
        "day",
        "start_time",
        "end_time",
        "created_at",
        "updated_at",
    )   