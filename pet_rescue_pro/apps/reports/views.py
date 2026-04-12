from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q

from apps.core.mixins import ResponseMixin
from .models import PetReport
from .serializer import PetReportSerializer, PetReportCreateSerializer
from apps.core.permission import IsAdmin, IsUser
from apps.notifications.models import Notification
from apps.users.models import User
from .utils import find_matches

class PetReportViewSet(viewsets.ModelViewSet, ResponseMixin):
    queryset = PetReport.objects.all()
    serializer_class = PetReportSerializer

    def get_serializer_class(self):
        if self.action == 'create_report':
            return PetReportCreateSerializer
        return PetReportSerializer


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

    @action(detail=True, methods=['get'], url_path='get-report', permission_classes=[IsAuthenticated])
    def get_report(self, request, *args, **kwargs):
        report = self.get_object()
        serializer = self.get_serializer(report)
        return self.success_response(
            data=serializer.data,
            message="Report fetched successfully",
            status_code = status.HTTP_200_OK
        )

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
    
    @action(detail=False, methods=['post'], url_path='create-report', permission_classes=[IsAuthenticated])
    def create_report(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        report = serializer.save()

        admins = User.objects.filter(role="Admin")
        for admin in admins:
            Notification.objects.create(
                user=admin,
                report=report,
                notification_type="Report_Creation",
                title="New Report Created",
                message=f"New report created by {report.user.username} for {report.pet.name if report.pet else 'a pet'}",
            )

        # Automatically search for matches
        find_matches(report)

        return self.success_response(
            data=serializer.data,
            message="Pet and Report created successfully",
            status_code = status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=['get'], url_path='all-reports', permission_classes=[IsAuthenticated])
    def all_reports(self, request, *args, **kwargs):
        queryset = self.get_queryset().exclude(user=request.user).filter(status="Accepted")
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
        species = request.query_params.get('type')
        breed = request.query_params.get('breed')
        location = request.query_params.get('location')
        color = request.query_params.get('color')

        # Apply filters through linked Pet model
        if species:
            queryset = queryset.filter(pet__species__icontains=species)
        if breed:
            queryset = queryset.filter(pet__breed__icontains=breed)
        if location:
            queryset = queryset.filter(location__icontains=location)
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

    @action(detail=False, methods=['get'], url_path='admin-get-all', permission_classes=[IsAuthenticated, IsAdmin])
    def get_all_reports(self, request, *args, **kwargs):
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

    @action(detail=True, methods=['put', 'patch'], url_path='admin-update-report', permission_classes=[IsAuthenticated, IsAdmin])
    def update_report(self, request, *args, **kwargs):
        partial = request.method == "PATCH"
        instance = self.get_object()
        old_status = instance.status
        
        serializer = self.get_serializer(instance, data = request.data, partial = partial)
        serializer.is_valid(raise_exception=True)
        report = serializer.save()

        if old_status != report.status:
            # If report is accepted and it was a 'Found' pet, make it available for adoption
            if report.status == "Accepted" and report.report_type == "Found":
                report.pet.status = "Available"
                report.pet.save()

            Notification.objects.create(
                user=report.user,
                report=report,
                notification_type="Report_Status",
                title="Report Status Updated",
                message=f"Your report for {report.pet.name if report.pet else 'your pet'} has been updated from {old_status} to {report.status}.",
            )

        return self.success_response(
            data=serializer.data,
            message="Report updated successfully",
            status_code=status.HTTP_202_ACCEPTED
        )
