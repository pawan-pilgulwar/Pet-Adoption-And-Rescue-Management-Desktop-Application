from rest_framework import serializers
from .models import RescueRequest

class RescueRequestSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    user_detail = serializers.StringRelatedField(source="user", read_only=True)
    report_detail = PetReportSerializer(source="report", read_only=True)

    def validate_report(self, value):
        if value.status != 'Pending':
            raise serializers.ValidationError("This report is not currently available for rescue.")
        return value

    class Meta:
        model = RescueRequest
        fields = [
            "id",
            "report",
            "report_detail",
            "user",
            "user_detail",
            "status",
            "request_details",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ('created_at', 'updated_at')