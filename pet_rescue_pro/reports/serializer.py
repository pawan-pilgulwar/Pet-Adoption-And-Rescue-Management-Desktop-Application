from rest_framework import serializers
from .models import PetReport
from pets.models import Pet
from pets.serializer import PetSerializer


class PetReportSerializer(serializers.ModelSerializer):

    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )

    user_detail = serializers.StringRelatedField(
        source="user",
        read_only=True
    )

    

    pet_data = serializers.SerializerMethodField()

    class Meta:
        model = PetReport
        fields = [
            "id",
            "user",
            "user_detail",
            "pet_data",
            "location",
            "description",
            "admin_comment",
            "created_at",
            "reviewed_at",
            "status"
        ]
        read_only_fields = [
            "created_at",
            "reviewed_at",
            "admin_comment", 
        ]

    def get_pet_data(self, obj):
        return {
            "name": obj.pet_name,
            "pet_type": obj.pet_type,
            "breed": obj.pet_breed,
            "color": obj.pet_color,
            "status": obj.pet_status,
            "image": obj.pet_image.url if obj.pet_image else None   
        }


class PetReportCreateSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )

    pet_data = serializers.DictField(write_only=True)

    class Meta:
        model = PetReport
        fields = [
            "user",
            "pet_data",   
            "location",
            "description",
            "admin_comment",
            "status"
        ]
        read_only_fields = [
            "admin_comment",
            "status"    
        ]

    def create(self, validated_data):
        pet_data = validated_data.pop("pet_data")

        report = PetReport.objects.create(
            user=validated_data["user"],
            pet_name=pet_data.get("name"),
            pet_type=pet_data.get("pet_type"),
            pet_breed=pet_data.get("breed"),
            pet_color=pet_data.get("color"),
            pet_image=pet_data.get("image"),
            pet_status=pet_data.get("status", "Lost"),
            location=validated_data.get("location"),
            description=validated_data.get("description"),
        )

        return report


