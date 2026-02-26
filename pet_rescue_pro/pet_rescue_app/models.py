from django.db import models

# Create your models here.
class User(models.Model):
    USER_ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('user', 'User'),
    ]
    username = models.CharField(max_length=100, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    profile_picture = models.ImageField(upload_to="profiles/", null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, unique=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True,)
    created_at = models.DateTimeField(auto_now_add=True)
    role = models.CharField(max_length=20, default="User", choices=USER_ROLE_CHOICES)


    def __str__(self):
        return self.username

    class Meta:
        db_table = 'user'

        
class Pet(models.Model):
    PET_STATUS_CHOICES = [
        ("Lost", "Lost"),
        ("Found", "Found"),
    ]

    name = models.CharField(max_length=100)
    pet_type = models.CharField(max_length=50)
    breed = models.CharField(max_length=50)
    color = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=PET_STATUS_CHOICES)
    location = models.CharField(max_length=200)
    image = models.ImageField(upload_to="pets/", null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'pet'


class PetReport(models.Model):
    REPORT_STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Accepted", "Accepted"),
        ("Rejected", "Rejected"),
        ("Closed", "Closed"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE)
    description = models.TextField()
    contact_number = models.CharField(max_length=15)
    report_status = models.CharField(
        max_length=20,
        choices=REPORT_STATUS_CHOICES,
        default="Pending"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.pet.name} - {self.report_status}"

    class Meta:
        db_table = 'pet_report'



class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message

    class Meta:
        db_table = 'notification'

