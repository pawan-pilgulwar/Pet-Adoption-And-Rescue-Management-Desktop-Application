from rest_framework import serializers
from .models import Report, RescueRequest
from apps.pets.models import Pet
from apps.pets.serializer import PetSerializer

class ReportSerializer(serializers.ModelSerializer):
    user_detail = serializers.StringRelatedField(source="user", read_only=True)
    pet_detail = PetSerializer(source="pet", read_only=True)
    user_contact = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = '__all__'
        read_only_fields = ['rescue_id', 'created_at', 'updated_at', 'user']

    def get_user_contact(self, obj):
        profile_data = {}
        if obj.user.role == 'USER' and hasattr(obj.user, 'user_profile'):
            profile_data = {
                "phone": obj.user.user_profile.phone_number,
                "address": obj.user.user_profile.address,
            }
        elif obj.user.role == 'SHOP_OWNER' and hasattr(obj.user, 'shop_profile'):
            profile_data = {
                "phone": obj.user.shop_profile.phone_number,
                "address": obj.user.shop_profile.shop_address,
            }
            
        return {
            "username": obj.user.username,
            "email": obj.user.email,
            "phone": profile_data.get("phone", "—"),
            "address": profile_data.get("address", "—"),
        }

class ReportCreateSerializer(serializers.ModelSerializer):
    pet_data = serializers.DictField(write_only=True)

    class Meta:
        model = Report
        fields = ['report_type', 'pet_data', 'location', 'description']

    def create(self, validated_data):
        pet_data = validated_data.pop("pet_data")
        user = self.context['request'].user
        
        # Create Pet instance
        pet = Pet.objects.create(
            name=pet_data.get("name"),
            species=pet_data.get("species"),
            breed=pet_data.get("breed"),
            color=pet_data.get("color"),
            age=pet_data.get("age"),
            gender=pet_data.get("gender"),
            size=pet_data.get("size"),
            image_url=pet_data.get("image_url"),
            image_public_id=pet_data.get("image_public_id"),
            created_by=user
        )

        report = Report.objects.create(
            user=user,
            pet=pet,
            **validated_data
        )

        return report

class RescueRequestSerializer(serializers.ModelSerializer):
    user_detail = serializers.StringRelatedField(source="user", read_only=True)
    report_detail = ReportSerializer(source="report", read_only=True)

    class Meta:
        model = RescueRequest
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'user']
