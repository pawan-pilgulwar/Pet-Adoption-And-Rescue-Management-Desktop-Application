from rest_framework import serializers
from .models import Adoption, AdoptionListing, AdoptionRequest
from apps.pets.serializer import PetSerializer
from apps.users.serializer import UserReadSerializer

class AdoptionListingSerializer(serializers.ModelSerializer):
    pet_detail = PetSerializer(source="pet", read_only=True)
    shop_detail = UserReadSerializer(source="shop_owner", read_only=True)

    class Meta:
        model = AdoptionListing
        fields = '__all__'
        read_only_fields = ['created_at', 'shop_owner']

class AdoptionRequestSerializer(serializers.ModelSerializer):
    user_detail = serializers.StringRelatedField(source="user", read_only=True)
    pet_detail = PetSerializer(source="pet", read_only=True)
    listing_detail = AdoptionListingSerializer(source="listing", read_only=True)

    class Meta:
        model = AdoptionRequest
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'user']

class AdoptionSerializer(serializers.ModelSerializer):
    user_detail = serializers.StringRelatedField(source="user", read_only=True)
    shop_detail = serializers.StringRelatedField(source="shop_owner", read_only=True)
    pet_detail = PetSerializer(source="pet", read_only=True)

    class Meta:
        model = Adoption
        fields = '__all__'
        read_only_fields = ['adopted_at']
