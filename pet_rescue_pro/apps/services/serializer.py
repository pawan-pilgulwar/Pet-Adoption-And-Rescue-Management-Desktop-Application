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
    
    shop_name = serializers.ReadOnlyField(source="created_by.shop_profile.shop_name")
    shop_contact = serializers.ReadOnlyField(source="created_by.shop_profile.phone_number")
    shop_address = serializers.ReadOnlyField(source="created_by.shop_profile.shop_address")

    class Meta:
        model = Service
        fields = [
            'id', 'name', 'description', 'price', 'image_url', 'duration', 
            'service_type', 'medical_type', 'doctor_name', 'clinic_address', 
            'owner_name', 'shop_name', 'shop_contact', 'shop_address',
            'created_by', 'schedules', 'created_at', 'updated_at'
        ]

class BookingSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.username')
    service_name = serializers.ReadOnlyField(source='service.name')
    service_price = serializers.ReadOnlyField(source='service.price')
    
    shop_name = serializers.ReadOnlyField(source="service.created_by.shop_profile.shop_name")
    shop_contact = serializers.ReadOnlyField(source="service.created_by.shop_profile.phone_number")
    shop_address = serializers.ReadOnlyField(source="service.created_by.shop_profile.shop_address")

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['user', 'status']
