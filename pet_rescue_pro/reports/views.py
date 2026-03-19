from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q

from core.mixins import ResponseMixin
from .models import PetReport
from .serializer import PetReportSerializer, PetReportCreateSerializer
from core.permission import IsAdmin, IsUser
from notifications.models import Notification
from users.models import User

# Create your views here.
class PetReportViewSet(viewsets.ModelViewSet, ResponseMixin):
    queryset = PetReport.objects.all()
    serializer_class = PetReportSerializer

    def get_serializer_class(self):
        if self.action == 'create_report':
            return PetReportCreateSerializer
        return PetReportSerializer


    # Get all user reports
    @action(detail=False, methods=['get'], url_path='get-user-reports', permission_classes=[IsAuthenticated | IsUser])
    def get_user_reports(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return self.success_response(
            data={
                "Count": queryset.count(),
                "Reports": serializer.data
            },
            message="User Reports fetched successfully",
            status_code = status.HTTP_200_OK
        )

    # Get a single report
    @action(detail=True, methods=['get'], url_path='get-report', permission_classes=[IsAuthenticated])
    def get_report(self, request, *args, **kwargs):
        report = self.get_object()
        serializer = self.get_serializer(report)
        return self.success_response(
            data=serializer.data,
            message="Report fetched successfully",
            status_code = status.HTTP_200_OK
        )

    # Delete the report
    @action(detail=True, methods=['delete'], url_path='delete-report', permission_classes=[IsAuthenticated, IsUser])
    def delete_report(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.user != request.user:
            return self.error_response(
                message="You can only delete your own report.",
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        instance.delete()
        return self.success_response(
            data={"deleted_report_id": instance.id},
            message="Report deleted successfully",
            status_code=status.HTTP_204_NO_CONTENT
        )
    
    # Generate the report
    @action(detail=False, methods=['post'], url_path='create-report', permission_classes=[IsAuthenticated , IsUser])
    def create_report(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        report = serializer.save()

        admins = User.objects.filter(role="Admin")
        for admin in admins:
            Notification.objects.create(
                user=admin,
                notification_type="Report_Creation",
                message=f"New report created by {report.user.username} for {report.pet_name}",
                related_object=report
            )

        return self.success_response(
            data=serializer.data,
            message="Pet and Report created successfully",
            status_code = status.HTTP_201_CREATED
        )
    

    # See all reports to find pet
    @action(detail=False, methods=['get'], url_path='all-reports', permission_classes=[IsAuthenticated])
    def all_reports(self, request, *args, **kwargs):
        queryset = self.queryset.exclude(user=request.user).filter(status="Accepted")
        serializer = self.get_serializer(queryset, many=True)

        return self.success_response(
            data={
                "Count": queryset.count(),
                "Reports": serializer.data
            },
            message="Reports fetched successfully",
            status_code = status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'] ,url_path='search', permission_classes=[IsAuthenticated])
    def search_reports(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(status="Accepted")

        # Get query params
        pet_type = request.query_params.get('type')
        breed = request.query_params.get('breed')
        location = request.query_params.get('location')
        color = request.query_params.get('color')

        # Apply filters dynamically
        if pet_type:
            queryset = queryset.filter(pet__pet_type__icontains=pet_type)

        if breed:
            queryset = queryset.filter(pet__breed__icontains=breed)

        if location:
            queryset = queryset.filter(pet__location__icontains=location)

        if color:
            queryset = queryset.filter(pet__color__icontains=color)

        serializer = self.get_serializer(queryset, many=True)

        return self.success_response(
            data={
                "Count": queryset.count(),
                "Reports": serializer.data
            },
            message="Reports fetched successfully",
            status_code=status.HTTP_200_OK
        )
    
    
    


# ---------------    ADMIN VIEWS     -------------

    # Get all reports only for admin
    @action(detail=False, methods=['get'], url_path='admin-get-all', permission_classes=[IsAuthenticated, IsAdmin])
    def get_all_reports(self, request, *args, **kwargs):
        # Admins see all reports, or we can filter by reviewer if needed. 
        # Requirement: Admin must be able to list reports and update status.
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return self.success_response(
            data={
                "Count": queryset.count(),
                "Reports": serializer.data
            },
            message="Reports fetched successfully",
            status_code = status.HTTP_200_OK
        )


    # Update the report
    @action(detail=True, methods=['put', 'patch'], url_path='admin-update-report', permission_classes=[IsAuthenticated, IsAdmin])
    def update_report(self, request, *args, **kwargs):
        partial = request.method == "PATCH"
        instance = self.get_object()

        old_status = instance.status
        
        serializer = self.get_serializer(instance, data = request.data, partial = partial)
        serializer.is_valid(raise_exception=True)
        report = serializer.save()

        if old_status != report.status:
            if report.status == "Accepted":
                Notification.objects.create(
                    user=report.user,
                    notification_type="Report_Status",
                    message=f"Report status changed from {old_status} to {report.status}",
                    related_object=report
                )
            elif report.status == "Rejected":
                Notification.objects.create(
                    user=report.user,
                    notification_type="Report_Status",
                    message=f"Report status changed from {old_status} to {report.status}",
                    related_object=report
                )
            elif report.status == "Closed":
                Notification.objects.create(
                    user=report.user,
                    notification_type="Report_Status",
                    message=f"Report status changed from {old_status} to {report.status}",
                    related_object=report
                )

        return self.success_response(
            data=serializer.data,
            message="Report updated successfully",
            status_code=status.HTTP_202_ACCEPTED
        )





