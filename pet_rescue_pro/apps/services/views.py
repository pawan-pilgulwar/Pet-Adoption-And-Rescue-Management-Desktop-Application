from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from .models import Service, Booking, Schedule
from .serializer import ServiceSerializer, BookingSerializer, ScheduleSerializer
from apps.core.mixins import ResponseMixin

class ServiceViewSet(viewsets.ModelViewSet, ResponseMixin):
    queryset = Service.objects.select_related(
        'created_by', 'created_by__shop_profile'
    ).prefetch_related('schedules').all().order_by('-created_at')
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = self.queryset
        user = self.request.user
        my_services = self.request.query_params.get('my_services')

        if user.is_authenticated:
            if my_services == 'true':
                return queryset.filter(created_by=user)
            
            if user.role == 'SHOP_OWNER':
                if self.action == 'list':
                    # Default view for Shop Owner in main list: show OTHER shops
                    return queryset.exclude(created_by=user)
                elif self.action in ['update', 'partial_update', 'destroy']:
                    # Shop Owners can only edit or delete their own services
                    return queryset.filter(created_by=user)
            elif user.role == 'ADMIN':
                return queryset
            elif user.role == 'USER':
                if self.action in ['update', 'partial_update', 'destroy']:
                    # Standard users cannot edit or delete services at all
                    return queryset.none()
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class BookingViewSet(viewsets.ModelViewSet, ResponseMixin):
    queryset = Booking.objects.select_related(
        'user', 'user__user_profile', 'service', 'service__created_by', 'service__created_by__shop_profile'
    ).prefetch_related('service__schedules').all().order_by('-created_at')
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ADMIN":
            return self.queryset
        elif user.role == "SHOP_OWNER":
            # Show bookings for services created by this shop owner
            return self.queryset.filter(service__created_by=user)
        return self.queryset.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel_booking(self, request, pk=None):
        booking = self.get_object()
        booking.status = 'Cancelled'
        booking.save()
        return self.success_response(message="Booking cancelled successfully")

    @action(detail=True, methods=['post'], url_path='complete')
    def complete_booking(self, request, pk=None):
        booking = self.get_object()
        if request.user.role not in ['SHOP_OWNER', 'ADMIN']:
            return self.error_response(message="Only shop owners can complete bookings", status_code=status.HTTP_403_FORBIDDEN)
        booking.status = 'Completed'
        booking.save()
        return self.success_response(message="Booking marked as completed successfully")

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.select_related('service').all().order_by('-created_at')
    serializer_class = ScheduleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return self.queryset
        if user.role == "ADMIN":
            return self.queryset
        return self.queryset.filter(service__created_by=user)

