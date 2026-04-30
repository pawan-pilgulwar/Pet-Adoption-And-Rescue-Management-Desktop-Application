from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from .models import Service, Booking, Schedule
from .serializer import ServiceSerializer, BookingSerializer, ScheduleSerializer
from apps.core.mixins import ResponseMixin

class ServiceViewSet(viewsets.ModelViewSet, ResponseMixin):
    queryset = Service.objects.all().order_by('-created_at')
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Service.objects.all().order_by('-created_at')
        user = self.request.user

        if user.is_authenticated:
            if user.role == 'SHOP_OWNER':
                # Public view for Shop Owner: Show everyone ELSE's services
                return queryset.exclude(created_by=user)
            elif user.role == 'ADMIN':
                return queryset
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class BookingViewSet(viewsets.ModelViewSet, ResponseMixin):
    queryset = Booking.objects.all().order_by('-created_at')
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ADMIN":
            return Booking.objects.all()
        elif user.role == "SHOP_OWNER":
            # Show bookings for services created by this shop owner
            return Booking.objects.filter(service__created_by=user)
        return Booking.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel_booking(self, request, pk=None):
        booking = self.get_object()
        booking.status = 'Cancelled'
        booking.save()
        return self.success_response(message="Booking cancelled successfully")

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all().order_by('-created_at')
    serializer_class = ScheduleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return Schedule.objects.all()
        if user.role == "ADMIN":
            return Schedule.objects.all()
        return Schedule.objects.filter(service__created_by=user)
