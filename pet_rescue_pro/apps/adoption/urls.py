from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import AdoptionRequestViewSet

router = DefaultRouter()
router.register(r'adoption', AdoptionRequestViewSet, basename='adoption')

urlpatterns = [
    path('', include(router.urls)),
]
