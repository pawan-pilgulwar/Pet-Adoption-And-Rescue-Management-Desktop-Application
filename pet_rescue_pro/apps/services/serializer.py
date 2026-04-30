from rest_framework import serializers
from .models import Service, Booking, Schedule
from apps.users.models import User

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    schedules = ScheduleSerializer(many=True, read_only=True)
    owner_name = serializers.ReadOnlyField(source='created_by.username')
    
    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'price', 'image_url', 'duration', 'service_type', 'medical_type', 'doctor_name', 'clinic_address', 'owner_name', 'created_by', 'schedules', 'created_at', 'updated_at']

class BookingSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.username')
    service_name = serializers.ReadOnlyField(source='service.name')
    service_price = serializers.ReadOnlyField(source='service.price')

    class Meta:
        model = Booking
        fields = '__all__'