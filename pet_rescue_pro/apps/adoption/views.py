from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import Adoption, AdoptionListing, AdoptionRequest
from .serializer import AdoptionSerializer, AdoptionListingSerializer, AdoptionRequestSerializer
from apps.core.mixins import ResponseMixin
from apps.core.permission import IsAdmin, IsShopOwner, IsAdminOrShopOwner
from apps.notifications.models import Notification

class AdoptionListingViewSet(viewsets.ModelViewSet, ResponseMixin):
    queryset = AdoptionListing.objects.all()
    serializer_class = AdoptionListingSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdminOrShopOwner()]

    def perform_create(self, serializer):
        serializer.save(shop_owner=self.request.user)

    def get_queryset(self):
        queryset = AdoptionListing.objects.all()
        user = self.request.user
        if user.role == 'USER':
            queryset = queryset.filter(is_available=True)
            
            # Simple filters
            species = self.request.query_params.get('species')
            breed = self.request.query_params.get('breed')
            if species:
                queryset = queryset.filter(pet__species__icontains=species)
            if breed:
                queryset = queryset.filter(pet__breed__icontains=breed)
        elif user.role == 'SHOP_OWNER':
            queryset = queryset.filter(shop_owner=user)
        elif user.role == 'ADMIN':
            queryset = queryset.all()   
        return queryset
    
    @action(detail=False, methods=['get'], url_path='search', permission_classes=[IsAuthenticated])
    def search(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        species = request.query_params.get('species')
        breed = request.query_params.get('breed')
        price = request.query_params.get('price')
        
        if species:
            queryset = queryset.filter(pet__species__icontains=species)
        if breed:
            queryset = queryset.filter(pet__breed__icontains=breed)
        if price:
            queryset = queryset.filter(price__lte=price)
            
        serializer = self.get_serializer(queryset, many=True)
        return self.success_response(data=serializer.data)

class AdoptionRequestViewSet(viewsets.ModelViewSet, ResponseMixin):
    queryset = AdoptionRequest.objects.all()
    serializer_class = AdoptionRequestSerializer

    def get_permissions(self):
        if self.action == 'accept' or self.action == 'reject':
            return [IsAuthenticated & IsShopOwner]
        return [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return AdoptionRequest.objects.all()
        if user.role == 'SHOP_OWNER':
            return AdoptionRequest.objects.filter(listing__shop_owner=user)
        return AdoptionRequest.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['patch'], url_path='accept-request')
    def accept(self, request, pk=None):
        adoption_request = self.get_object()
        if adoption_request.status == 'Approved':
            return self.error_response(message="This request is already approved")

        adoption_request.status = 'Approved'
        adoption_request.save()

        # Update Listing
        if adoption_request.listing:
            adoption_request.listing.is_available = False
            adoption_request.listing.save()

        # Create Final Adoption Record
        Adoption.objects.create(
            user=adoption_request.user,
            pet=adoption_request.pet,
            shop_owner=adoption_request.listing.shop_owner if adoption_request.listing else adoption_request.pet.created_by,
            price=adoption_request.listing.price if adoption_request.listing else 0.00,
        )

        # Create Notification
        Notification.objects.create(
            user=adoption_request.user,
            title="Adoption Request Accepted",
            message=f"Your adoption request for {adoption_request.pet.name} has been accepted.",
            notification_type="Adoption_Status"
        )

        return self.success_response(
            message="Adoption request accepted successfully",
            data=self.get_serializer(adoption_request).data
        )

    @action(detail=True, methods=['post'], url_path='reject-request')
    def reject(self, request, pk=None):
        adoption_request = self.get_object()
        adoption_request.status = 'Rejected'
        adoption_request.save()

        # Create Notification
        Notification.objects.create(
            user=adoption_request.user,
            title="Adoption Request Rejected",
            message=f"Your adoption request for {adoption_request.pet.name} has been rejected.",
            notification_type="Adoption_Status"
        )

        return self.success_response(
            message="Adoption request rejected successfully",
            data=self.get_serializer(adoption_request).data
        )

class AdoptionViewSet(viewsets.ModelViewSet, ResponseMixin):
    queryset = Adoption.objects.all()
    serializer_class = AdoptionSerializer

    def get_permissions(self):
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Adoption.objects.all()
        if user.role == 'SHOP_OWNER':
            return Adoption.objects.filter(shop_owner=user)
        return Adoption.objects.filter(user=user)
