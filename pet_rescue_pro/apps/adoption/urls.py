from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdoptionListingViewSet, AdoptionViewSet

router = DefaultRouter()
router.register(r'listings', AdoptionListingViewSet, basename='adoption-listings')
router.register(r'adoptions', AdoptionViewSet, basename='adoptions')

urlpatterns = [
    path('', include(router.urls)),
]