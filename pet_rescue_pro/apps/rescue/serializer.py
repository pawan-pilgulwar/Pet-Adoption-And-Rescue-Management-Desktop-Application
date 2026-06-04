from rest_framework import serializers
from .models import Report, RescueRequest
from apps.pets.models import Pet
from apps.pets.serializer import PetSerializer

from apps.users.serializer import UserReadSerializer

class ReportSerializer(serializers.ModelSerializer):
    user = UserReadSerializer(read_only=True)
    pet = PetSerializer(read_only=True)

    class Meta:
        model = Report
        fields = '__all__'
        read_only_fields = ['rescue_id', 'created_at', 'updated_at', 'user']

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
    user = UserReadSerializer(read_only=True)

    class Meta:
        model = RescueRequest
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'user']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['report'] = ReportSerializer(instance.report, context=self.context).data
        return representation

