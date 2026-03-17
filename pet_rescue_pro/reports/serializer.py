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

    pet_detail = PetSerializer(
        source="pet",
        read_only=True
    )

    class Meta:
        model = PetReport
        fields = [
            "id",
            "user",
            "user_detail",
            "pet",
            "pet_detail",
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


class PetReportCreateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)
    pet_type = serializers.CharField(write_only=True)
    breed = serializers.CharField(write_only=True, required=False, allow_blank=True)
    color = serializers.CharField(write_only=True, required=False, allow_blank=True)
    image = serializers.ImageField(write_only=True, required=False)
    
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = PetReport
        fields = [
            "user",
            "name",
            "pet_type",
            "breed",
            "color",
            "image",
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
        # Extract pet data from validated_data
        pet_fields = ['name', 'pet_type', 'breed', 'color', 'image']
        pet_data = {field: validated_data.pop(field) for field in pet_fields if field in validated_data}
        
        # Assign the user who reported as the one who 'created' the pet object initially
        user = self.context['request'].user
        pet_data['created_by'] = user
        # Set initial status for pet based on report or default
        pet_data['status'] = validated_data.get('status', 'Lost') 
        
        pet = Pet.objects.create(**pet_data)
        
        report = PetReport.objects.create(pet=pet, **validated_data)
        return report


