from rest_framework import serializers
from .models import Pet
import re

from apps.users.serializer import UserReadSerializer

class PetSerializer(serializers.ModelSerializer):
    owner = UserReadSerializer(read_only=True)
    created_by = UserReadSerializer(read_only=True)
    
    created_by_write = serializers.HiddenField(
        default=serializers.CurrentUserDefault(),
        source='created_by'
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
            "owner",
            "vaccination_status",
            "image_url",
            "image_public_id",
            "created_at",
            "updated_at",
            "created_by",
            "created_by_write"
        ]
        read_only_fields = [
            "pet_id",
            "created_at",
            "updated_at",
        ]


    def validate_name(self, value):
        if not re.match(r'^[A-Za-z\s]+$', value):
            raise serializers.ValidationError("Name must contain only letters.")
        return value
    
    def validate_species(self, value):
        if not re.match(r'^[A-Za-z\s]+$', value):
            raise serializers.ValidationError("Species must contain only letters.")
        return value

    def create(self, validated_data):
        if self.context['request'].user.role == "SHOP_OWNER":
            validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)
