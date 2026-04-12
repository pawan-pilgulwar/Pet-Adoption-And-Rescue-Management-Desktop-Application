from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import PetReportViewSet

router = DefaultRouter()
router.register(r'reports', PetReportViewSet)


urlpatterns = router.urls

