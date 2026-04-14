from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import RescueRequestViewSet

router = DefaultRouter()
router.register(r'rescue-requests', RescueRequestViewSet)

urlpatterns = router.urls   