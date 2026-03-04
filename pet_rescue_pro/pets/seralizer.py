from rest_framework import serializers
from .models import Pet
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken   


from core.constants import PET_STATUS_CHOICES
import re

class PetSerializer(serializers.ModelSerializer):
    name = serializers.CharField()


    created_by = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = Pet
        fields = '__all__'

    def validate_name(self, value):
        if not re.match(r'^[A-Za-z\s]+$', value):
            raise serializers.ValidationError("Name must contain only letters.")
        return value
    
    def validate_pet_type(self, value):
        if not re.match(r'^[A-Za-z\s]+$', value):
            raise serializers.ValidationError("Pet type must contain only letters.")
        return value
    