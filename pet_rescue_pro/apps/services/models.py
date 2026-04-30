from django.db import models
from apps.users.models import User

class Service(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField(blank=True, null=True)
    duration = models.CharField(max_length=50, blank=True, null=True, help_text="e.g. 1 hour, 30 mins")
    
    # Medical Service Fields
    service_type = models.CharField(
        max_length=20,
        choices=[("General", "General"), ("Medical", "Medical")],
        default="General"
    )
    medical_type = models.CharField(max_length=50, blank=True, null=True)
    doctor_name = models.CharField(max_length=100, blank=True, null=True)
    clinic_address = models.TextField(blank=True, null=True)

    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='services_created', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'service'

class Booking(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Cancelled', 'Cancelled'),
        ('Completed', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='bookings')
    booking_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    additional_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} booked {self.service.name} on {self.booking_date}"

    class Meta:
        db_table = 'booking'

class Schedule(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='schedules')
    day = models.CharField(max_length=10)
    start_time = models.TimeField()
    end_time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.service.name} on {self.day} from {self.start_time} to {self.end_time}"

    class Meta:
        db_table = 'schedule'
