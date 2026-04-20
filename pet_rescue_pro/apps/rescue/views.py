from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Report, RescueRequest
from .serializer import ReportSerializer, ReportCreateSerializer, RescueRequestSerializer
from apps.core.mixins import ResponseMixin
from apps.core.permission import IsAdmin
from apps.notifications.models import Notification

class ReportViewSet(viewsets.ModelViewSet, ResponseMixin):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return ReportCreateSerializer
        return ReportSerializer

    def get_queryset(self):
        queryset = Report.objects.all()
        if self.action == 'list':
            # Public list only shows verified reports
            return queryset.filter(is_verified=True)
        
        user = self.request.user
        if not user.is_authenticated:
            return queryset.filter(is_verified=True)
            
        if user.role == 'ADMIN':
            return queryset
        return queryset.filter(user=user)

    @action(detail=False, methods=['get'], url_path='search', permission_classes=[AllowAny])
    def search(self, request):
        queryset = Report.objects.filter(is_verified=True)
        species = request.query_params.get('species')
        breed = request.query_params.get('breed')
        location = request.query_params.get('location')
        
        if species:
            queryset = queryset.filter(pet__species__icontains=species)
        if breed:
            queryset = queryset.filter(pet__breed__icontains=breed)
        if location:
            queryset = queryset.filter(location__icontains=location)
            
        serializer = self.get_serializer(queryset, many=True)
        return self.success_response(data=serializer.data)

    @action(detail=True, methods=['post'], url_path='verify', permission_classes=[IsAdmin])
    def verify(self, request, pk=None):
        report = self.get_object()
        report.is_verified = True
        report.status = 'Accepted'
        report.save()
        
        Notification.objects.create(
            user=report.user,
            title="Report Verified",
            message=f"Your report for {report.pet.name if report.pet else 'a pet'} has been verified.",
            notification_type="Report_Status"
        )
        
        return self.success_response(message="Report verified successfully")

    @action(detail=False, methods=['get'], url_path='my-reports', permission_classes=[IsAuthenticated])
    def my_reports(self, request):
        queryset = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return self.success_response(data=serializer.data)

class RescueRequestViewSet(viewsets.ModelViewSet, ResponseMixin):
    queryset = RescueRequest.objects.all()
    serializer_class = RescueRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return RescueRequest.objects.all()
        return RescueRequest.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='my-requests', permission_classes=[IsAuthenticated])
    def my_requests(self, request):
        queryset = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return self.success_response(data=serializer.data)  
