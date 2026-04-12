from rest_framework import serializers
from .models import PetReport
from apps.pets.models import Pet
from apps.pets.serializer import PetSerializer

class PetReportSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    user_detail = serializers.StringRelatedField(source="user", read_only=True)
    pet = PetSerializer(read_only=True)
    user_contact = serializers.SerializerMethodField()

    class Meta:
        model = PetReport
        fields = [
            "id",
            "rescue_id",
            "user",
            "user_detail",
            "user_contact",
            "pet",
            "report_type",
            "location",
            "description",
            "report_status",
            "status",
            "date_reported",
            "admin_comment",
            "created_at",
            "reviewed_at",
        ]
        read_only_fields = [
            "rescue_id",
            "created_at",
            "reviewed_at",
            "admin_comment",
            "date_reported",
        ]

    def get_user_contact(self, obj):
        return {
            "email": obj.user.email,
            "phone": obj.user.phone_number,
            "address": obj.user.address,
        }

class PetReportCreateSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    pet_data = serializers.DictField(write_only=True)

    class Meta:
        model = PetReport
        fields = [
            "user",
            "report_type",
            "pet_data",
            "location",
            "description",
        ]

    def create(self, validated_data):
        pet_data = validated_data.pop("pet_data")
        
        # Create Pet instance with status corresponding to the report
        pet = Pet.objects.create(
            name=pet_data.get("name"),
            species=pet_data.get("species") or pet_data.get("pet_type"),
            breed=pet_data.get("breed"),
            color=pet_data.get("color"),
            age=pet_data.get("age"),
            gender=pet_data.get("gender"),
            size=pet_data.get("size"),
            image=pet_data.get("image"),
            created_by=validated_data.get("user"),
            status=validated_data.get("report_type") # Link Pet status to Report type
        )

        report = PetReport.objects.create(
            user=validated_data.get("user"),
            pet=pet,
            report_type=validated_data.get("report_type"),
            location=validated_data.get("location"),
            description=validated_data.get("description"),
        )

        return report
