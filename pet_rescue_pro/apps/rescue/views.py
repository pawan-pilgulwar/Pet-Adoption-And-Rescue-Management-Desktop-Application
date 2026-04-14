from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from apps.core.mixins import ResponseMixin
from .models import RescueRequest
from .serializer import RescueRequestSerializer
from apps.core.permission import IsAdmin, IsUser
from apps.notifications.models import Notification
from apps.users.models import User

class RescueRequestViewSet(ResponseMixin, viewsets.ModelViewSet):
    queryset = RescueRequest.objects.all()
    serializer_class = RescueRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'create']:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdmin()]

    def get_queryset(self):
        if self.request.user.is_staff:
            return RescueRequest.objects.all()
        return RescueRequest.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='my-requests', permission_classes=[IsAuthenticated])
    def my_requests(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return self.success_response(
            message="Your rescue requests fetched successfully",
            status_code=status.HTTP_200_OK
        )

    # ---------------    Admin Views     -----------------------    

    @action(detail=True, methods=['post'], url_path='accept-request', permission_classes=[IsAuthenticated, IsAdmin])
    def accept(self, request, pk=None):
        rescue_request = self.get_object()
        rescue_request.status = 'Accepted'
        rescue_request.save()

        # Create Notification
        Notification.objects.create(
            user=rescue_request.user,
            title="Rescue Request Accepted",
            message=f"Your rescue request for {rescue_request.pet.name} has been accepted.",
            notification_type="Rescue"
        )

        return self.success_response(
            message="Rescue request accepted successfully",
            data=self.get_serializer(rescue_request).data
        )

    @action(detail=True, methods=['post'], url_path='reject-request', permission_classes=[IsAuthenticated, IsAdmin])
    def reject(self, request, pk=None):
        rescue_request = self.get_object()
        rescue_request.status = 'Rejected'
        rescue_request.save()

        # Create Notification
        Notification.objects.create(
            user=rescue_request.user,
            title="Rescue Request Rejected",
            message=f"Your rescue request for {rescue_request.pet.name} has been rejected.",
            notification_type="Rescue"
        )

        return self.success_response(
            message="Rescue request rejected successfully",
            data=self.get_serializer(rescue_request).data
        )
