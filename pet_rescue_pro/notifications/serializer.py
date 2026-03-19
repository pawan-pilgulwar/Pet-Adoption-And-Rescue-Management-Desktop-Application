from rest_framework import serializers
from .models import Notification
from users.serializer import UserReadSerializer
from pets.serializer import PetSerializer
from reports.serializer import PetReportSerializer

class NotificationSerializer(serializers.ModelSerializer):
    user = UserReadSerializer(read_only=True)
    pet = PetSerializer(read_only=True)
    report = PetReportSerializer(read_only=True)
    
    class Meta:
        model = Notification
        fields = '__all__'

    def get_user(self, obj):
        return obj.user.username
    
    def get_pet(self, obj):
        return obj.pet.name
    
    def get_report(self, obj):
        return obj.report.title