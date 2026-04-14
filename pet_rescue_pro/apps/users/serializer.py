import re

from rest_framework import serializers
from .models import User
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken
from apps.core.constants import USER_ROLE_CHOICES
from .models import User, UserProfile, ShopOwnerProfile, AdminProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['address', 'phone_number', 'profile_picture_url', 'profile_picture_public_id']

class ShopOwnerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopOwnerProfile
        fields = ['shop_name', 'shop_address', 'phone_number', 'shop_license', 'profile_picture_url', 'profile_picture_public_id']

class AdminProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminProfile
        fields = ['admin_level', 'profile_picture_url', 'profile_picture_public_id']

class UserWriteSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True, min_length=5)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    
    # Profile fields (flattened for easy registration)
    address = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    phone_number = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    shop_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    shop_address = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    shop_license = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    profile_picture_url = serializers.URLField(required=False, allow_blank=True, allow_null=True)
    profile_picture_public_id = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = User
        fields = [
            "id", "username", "first_name", "last_name", "email", 
            "password", "role", "created_at",
            "address", "phone_number", "shop_name", "shop_address", 
            "shop_license", "profile_picture_url", "profile_picture_public_id"
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "shop_license": {"write_only": True},
        }

    def validate(self, data):
        role = data.get("role")
        if role == "SHOP_OWNER":
            if not data.get("shop_name"):
                raise serializers.ValidationError("Shop name is required for shop owners")
            if not data.get("shop_address"):
                raise serializers.ValidationError("Shop address is required for shop owners")
            if not data.get("shop_license"):
                raise serializers.ValidationError("Shop license is required for shop owners")
        elif role == "USER":
            if not data.get("address"):
                raise serializers.ValidationError("Address is required for users")
            if not data.get("phone_number"):
                raise serializers.ValidationError("Phone number is required for users")
        return data
    

    def create(self, validated_data):
        # Extract profile fields
        profile_data = {
            'address': validated_data.pop('address', None),
            'phone_number': validated_data.pop('phone_number', None),
            'shop_name': validated_data.pop('shop_name', None),
            'shop_address': validated_data.pop('shop_address', None),
            'shop_license': validated_data.pop('shop_license', None),
            'profile_picture_url': validated_data.pop('profile_picture_url', None),
            'profile_picture_public_id': validated_data.pop('profile_picture_public_id', None),
        }
        
        validated_data['password'] = make_password(validated_data['password'])
        user = super().create(validated_data)
        
        # Signals will create the profile object, we just need to update it
        if user.role == "USER":
            profile = user.user_profile
            profile.address = profile_data['address']
            profile.phone_number = profile_data['phone_number']
            profile.profile_picture_url = profile_data['profile_picture_url']
            profile.profile_picture_public_id = profile_data['profile_picture_public_id']
            profile.save()
        elif user.role == "SHOP_OWNER":
            profile = user.shop_profile
            profile.shop_name = profile_data['shop_name']
            profile.shop_address = profile_data['shop_address']
            profile.phone_number = profile_data['phone_number']
            profile.shop_license = profile_data['shop_license']
            profile.profile_picture_url = profile_data['profile_picture_url']
            profile.profile_picture_public_id = profile_data['profile_picture_public_id']
            profile.save()
        elif user.role == "ADMIN":
            profile = user.admin_profile
            profile.admin_level = profile_data['admin_level']
            profile.profile_picture_url = profile_data['profile_picture_url']
            profile.profile_picture_public_id = profile_data['profile_picture_public_id']
            profile.save()
            
        return user

class UserReadSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", "username", "first_name", "last_name", "email",
            "role", "created_at", "profile"
        ]

    def get_profile(self, obj):
        if obj.role == "USER" and hasattr(obj, 'user_profile'):
            return UserProfileSerializer(obj.user_profile).data
        elif obj.role == "SHOP_OWNER" and hasattr(obj, 'shop_profile'):
            return ShopOwnerProfileSerializer(obj.shop_profile).data
        elif obj.role == "ADMIN" and hasattr(obj, 'admin_profile'):
            return AdminProfileSerializer(obj.admin_profile).data
        return None
    

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password")

        if not check_password(password, user.password):
            raise serializers.ValidationError("Invalid email or password")


        refresh = RefreshToken.for_user(user)

        return {
            "user_id": user.id,
            "username": user.username,
            "role": user.role,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }
