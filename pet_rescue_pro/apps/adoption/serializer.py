from rest_framework import serializers
from .models import AdoptionRequest
from apps.pets.serializer import PetSerializer

class AdoptionRequestSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    user_detail = serializers.StringRelatedField(source="user", read_only=True)
    pet_detail = PetSerializer(source="pet", read_only=True)

    def validate_pet(self, value):
        # A pet is adoptable if it's marked Available OR has an Accepted report
        if value.status != 'Available' and not value.reports.filter(status='Accepted').exists():
            raise serializers.ValidationError("This pet is not currently available for adoption.")
        return value

    class Meta:
        model = AdoptionRequest
        fields = [
            "id",
            "pet",
            "pet_detail",
            "user",
            "user_detail",
            "status",
            "request_details",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]
