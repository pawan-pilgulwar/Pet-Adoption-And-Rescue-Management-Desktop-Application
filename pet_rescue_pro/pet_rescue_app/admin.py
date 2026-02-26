from django.contrib import admin
from .models import Pet, User, PetReport, Notification

# Register your models here.
admin.site.register(User)
admin.site.register(Pet)
admin.site.register(PetReport)
admin.site.register(Notification)