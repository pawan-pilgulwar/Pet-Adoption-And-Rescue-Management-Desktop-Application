from rest_framework import serializers
from .models import Pet
import re

class PetSerializer(serializers.ModelSerializer):
    created_by = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )
    
    created_by_detail = serializers.StringRelatedField(
        source="created_by",
        read_only=True
    )

    class Meta:
        model = Pet
        fields = [
            "id",
            "pet_id",
            "name",
            "species",
            "breed",
            "color",
            "age",
            "gender",
            "size",
            "description",
            "vaccination_status",
            "status",   
            "image_url",
            "image_public_id",
            "created_at",
            "updated_at",
            "created_by",
            "created_by_detail"
        ]
        read_only_fields = [
            "pet_id",
            "created_at",
            "updated_at",
            "created_by_detail"
        ]

    def validate_name(self, value):
        if not re.match(r'^[A-Za-z\s]+$', value):
            raise serializers.ValidationError("Name must contain only letters.")
        return value
    
    def validate_species(self, value):
        if not re.match(r'^[A-Za-z\s]+$', value):
            raise serializers.ValidationError("Species must contain only letters.")
        return value
