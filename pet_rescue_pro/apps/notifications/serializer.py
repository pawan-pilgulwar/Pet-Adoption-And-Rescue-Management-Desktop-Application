from rest_framework import serializers
from .models import Notification
from apps.users.serializer import UserReadSerializer
from apps.pets.serializer import PetSerializer
from apps.reports.serializer import PetReportSerializer

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
        return obj.pet.name if obj.pet else None
    
    def get_report(self, obj):
        # reports no longer have pet_name field, so we use pet translation or rescue_id
        return obj.report.pet.name if (obj.report and obj.report.pet) else None
