from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.contrib.auth.hashers import make_password, check_password

from core.mixins import ResponseMixin
from .models import PetReport
from .serializer import PetReportSerializer
from core.permission import IsAdmin, IsSuperAdmin

# Create your views here.
class PetReportViewSet(viewsets.ModelViewSet, ResponseMixin):
    queryset = PetReport.objects.all()
    serializer_class = PetReportSerializer

    @action(detail=False, methods=['get'], url_path='get-all', permission_classes=[IsAuthenticated, IsAdmin | IsSuperAdmin])
    def get_all_reports(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(reviewed_by=request.user.id)
        serializer = self.serializer_class(queryset, many=True)
        return self.success_response(
            data={
                "Count": queryset.count(),
                "Reports": serializer.data
            },
            message="Reports by the admin user are fetched successfully",
            status_code = status.HTTP_200_OK
        )


    @action(detail=True, methods=['get'], url_path='get-report', permission_classes=[IsAuthenticated, IsAdmin | IsSuperAdmin])
    def get_report(self, request, *args, **kwargs):
        pk = kwargs['pk']
        report = PetReport.objects.get(pk=pk)
        serializer = self.serializer_class(report)
        return self.success_response(
            data=serializer.data,
            message="Report is fetched successfully",
            status_code = status.HTTP_200_OK
        )

    @action(detail=False, methods=['post'], url_path='create-report', permission_classes=[IsAuthenticated, IsAdmin | IsSuperAdmin])
    def create_report(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return self.success_response(
            data=serializer.data,
            message="Report created successfully",
            status_code = status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['put', 'patch'], url_path='update-report', permission_classes=[IsAuthenticated, IsAdmin | IsSuperAdmin])
    def update_report(self, request, *args, **kwargs):
        partial = request.method == "PATCH"
        instance = self.get_object()
        serializer = self.get_serializer(instance, data = request.data, partial = partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return self.success_response(
            data=serializer.data,
            message="Report updated successfully",
            status_code=status.HTTP_202_ACCEPTED
        )

    @action(detail=True, methods=['delete'], url_path='delete-report', permission_classes=[IsAuthenticated, IsSuperAdmin])
    def delete_report(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return self.success_response(
            data={"deleted_report_id": instance.id},
            message="Report deleted successfully",
            status_code=status.HTTP_204_NO_CONTENT
        )