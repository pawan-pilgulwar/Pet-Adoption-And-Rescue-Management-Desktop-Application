from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, PetReportViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'pet-reports', PetReportViewSet)


urlpatterns = router.urls

