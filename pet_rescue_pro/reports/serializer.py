from rest_framework import serializers
from .models import PetReport
from rest_framework_simplejwt.tokens import RefreshToken   


from core.constants import PET_STATUS_CHOICES
import re

class PetReportSerializer(serializers.ModelSerializer):

    reviewed_by = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )

    reviewed_by_detail = serializers.StringRelatedField(
        source="reviewed_by",
        read_only=True
    )

    pet_detail = serializers.StringRelatedField(
        source = "pet",
        read_only = True
    )

    class Meta:
        model = PetReport
        fields = [
            "id",
            "pet_detail",
            "admin_comment",
            "report_status",
            "reviewed_by",
            "created_at",
            "reviewed_at",
            "reviewed_by_detail"
        ]
        extra_kwargs = {
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
            "created_by_detail": {"read_only": True}
        }

    def validate_name(self, value):
        if not re.match(r'^[A-Za-z\s]+$', value):
            raise serializers.ValidationError("Name must contain only letters.")
        return value
    
    def validate_pet_type(self, value):
        if not re.match(r'^[A-Za-z\s]+$', value):
            raise serializers.ValidationError("Pet type must contain only letters.")
        return value

    def validate_report_status(self, value):
        if value not in ["pending", "approved", "rejected"]:
            raise serializers.ValidationError("Invalid report status.")
        return value
    

