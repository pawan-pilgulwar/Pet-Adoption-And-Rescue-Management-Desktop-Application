from rest_framework import serializers
from .models import Adoption, AdoptionListing
from apps.pets.serializer import PetSerializer
from apps.users.serializer import UserReadSerializer

class AdoptionListingSerializer(serializers.ModelSerializer):
    pet = PetSerializer(read_only=True)
    shop_owner = UserReadSerializer(read_only=True)

    class Meta:
        model = AdoptionListing
        fields = '__all__'
        read_only_fields = ['created_at', 'shop_owner']

class AdoptionSerializer(serializers.ModelSerializer):
    user = UserReadSerializer(read_only=True)
    shop_owner = UserReadSerializer(read_only=True)

    class Meta:
        model = Adoption
        fields = '__all__'
        read_only_fields = ['adopted_at', 'user', 'shop_owner', 'price']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['pet'] = PetSerializer(instance.pet, context=self.context).data
        return representation
