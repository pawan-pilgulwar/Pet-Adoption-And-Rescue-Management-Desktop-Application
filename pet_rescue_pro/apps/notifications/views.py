from rest_framework import viewsets, status
from .models import Notification
from .serializer import NotificationSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from apps.core.mixins import ResponseMixin
from rest_framework.decorators import action

class NotificationViewSet(viewsets.ModelViewSet, ResponseMixin):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return self.success_response(
            data={
                "Count": queryset.count(),
                "Notifications": serializer.data
            },
            message="Notifications fetched successfully",
            status_code=status.HTTP_200_OK
        )

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    def get_object(self):
        obj = super().get_object()
        if obj.user != self.request.user:
            raise PermissionDenied
        return obj

    def perform_update(self, serializer):
        serializer.save(is_read=True)   

        

    # ------------    User and Admin routes for Notifications    ------------

    @action(detail=False, methods=['get'], url_path='get-user-notifications', permission_classes=[IsAuthenticated])
    def get_user_notifications(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return self.success_response(
            data={
                "Count": queryset.count(),
                "Notifications": serializer.data
            },
            message="Notifications fetched successfully",
            status_code = status.HTTP_200_OK
        )

    @action(detail=False, methods=['patch', 'get'], url_path='mark-all-as-read', permission_classes=[IsAuthenticated])
    def mark_all_as_read(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(is_read=False)
        queryset.update(is_read=True)
        return self.success_response(
            message="All notifications marked as read",
            status_code = status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'], url_path='get-unread-notifications', permission_classes=[IsAuthenticated])

    @action(detail=True, methods=['delete'], url_path='delete-notification', permission_classes=[IsAuthenticated])
    def delete_notification(self, request, *args, **kwargs):
        self.get_object().delete()
        return self.success_response(
            message="Notification deleted successfully",
            status_code = status.HTTP_200_OK
        )
