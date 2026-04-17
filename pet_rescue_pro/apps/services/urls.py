from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceViewSet, BookingViewSet, ScheduleViewSet

router = DefaultRouter()
router.register(r'pet-services', ServiceViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'schedules', ScheduleViewSet) 

urlpatterns = [
    path('', include(router.urls)),
]
