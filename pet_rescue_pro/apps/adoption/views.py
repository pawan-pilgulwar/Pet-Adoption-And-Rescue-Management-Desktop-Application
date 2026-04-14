from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from .models import AdoptionRequest
from .serializer import AdoptionRequestSerializer
from apps.core.mixins import ResponseMixin
from apps.core.permission import IsAdmin
from apps.notifications.models import Notification

class AdoptionRequestViewSet(viewsets.ModelViewSet, ResponseMixin):
    queryset = AdoptionRequest.objects.all()
    serializer_class = AdoptionRequestSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'create']:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdmin()]

    def get_queryset(self):
        if self.request.user.is_staff:
            return AdoptionRequest.objects.all()
        return AdoptionRequest.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user) 

    @action(detail=False, methods=['get'], url_path='my-requests', permission_classes=[IsAuthenticated])
    def my_requests(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return self.success_response(
            data=serializer.data,
            message="Your adoption requests fetched successfully",
            status_code=status.HTTP_200_OK
        )
    

    # ---------------    Admin Views     -----------------------
    
    @action(detail=True, methods=['post'], url_path='accept-request', permission_classes=[IsAuthenticated, IsAdmin])
    def accept(self, request, pk=None):
        adoption_request = self.get_object()
        adoption_request.status = 'Accepted'
        adoption_request.save()

        # Create Notification
        Notification.objects.create(
            user=adoption_request.user,
            title="Adoption Request Accepted",
            message=f"Your adoption request for {adoption_request.pet.name} has been accepted.",
            notification_type="Adoption"
        )

        return self.success_response(
            message="Adoption request accepted successfully",
            data=self.get_serializer(adoption_request).data
        )

    @action(detail=True, methods=['post'], url_path='reject-request', permission_classes=[IsAuthenticated, IsAdmin])
    def reject(self, request, pk=None):
        adoption_request = self.get_object()
        adoption_request.status = 'Rejected'
        adoption_request.save()

        # Create Notification
        Notification.objects.create(
            user=adoption_request.user,
            title="Adoption Request Rejected",
            message=f"Your adoption request for {adoption_request.pet.name} has been rejected.",
            notification_type="Adoption"
        )

        return self.success_response(
            message="Adoption request rejected successfully",
            data=self.get_serializer(adoption_request).data
        )

    @action(detail=True, methods=['patch'], url_path='admin-update-status', permission_classes=[IsAuthenticated, IsAdmin])
    def update_status(self, request, *args, **kwargs):
        instance = self.get_object()
        new_status = request.data.get("status")
        
        if not new_status:
            return self.error_response(message="Status is required", status_code=status.HTTP_400_BAD_REQUEST)
            
        instance.status = new_status
        instance.save()

        Notification.objects.create(
            user=instance.user,
            notification_type="Adoption_Status",
            title="Adoption Request Updated",
            message=f"Your adoption request for {instance.pet.name} has been {new_status}.",
            pet=instance.pet
        )

        return self.success_response(
            message=f"Adoption status updated to {new_status}",
            status_code=status.HTTP_200_OK
        )
