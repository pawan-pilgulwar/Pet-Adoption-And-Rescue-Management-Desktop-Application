from rest_framework import viewsets, permissions
from .models import Service, Booking, Schedule
from .serializer import ServiceSerializer, BookingSerializer, ScheduleSerializer

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all().order_by('-created_at')
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by('-created_at')
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ADMIN":
            return Booking.objects.all()
        # For SHOP_OWNER, maybe show bookings for their services if services were linked to shops
        # For now, keep it simple as requested: junior developer style.
        return Booking.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all().order_by('-created_at')
    serializer_class = ScheduleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ADMIN":
            return Schedule.objects.all()
        elif user.role == "SHOP_OWNER":
            return Schedule.objects.filter(service__user=user)
        return Schedule.objects.filter(service__user=user)
