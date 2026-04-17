from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReportViewSet, RescueRequestViewSet

router = DefaultRouter()
router.register(r'reports', ReportViewSet, basename='rescue-reports')
router.register(r'requests', RescueRequestViewSet, basename='rescue-requests')

urlpatterns = [
    path('', include(router.urls)),
]
