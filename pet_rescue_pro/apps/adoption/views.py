from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import Adoption, AdoptionListing
from .serializer import AdoptionSerializer, AdoptionListingSerializer
from apps.core.mixins import ResponseMixin
from apps.core.permission import IsAdmin, IsShopOwner, IsAdminOrShopOwner
from apps.notifications.models import Notification

class AdoptionListingViewSet(viewsets.ModelViewSet, ResponseMixin):
    queryset = AdoptionListing.objects.select_related(
        'pet', 'shop_owner', 'shop_owner__shop_profile'
    ).all()
    serializer_class = AdoptionListingSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdminOrShopOwner()]

    def perform_create(self, serializer):
        serializer.save(shop_owner=self.request.user)

    def get_queryset(self):
        queryset = self.queryset.order_by('-created_at')
        user = self.request.user
        my_listings = self.request.query_params.get('my_listings') == 'true'

        if user.is_authenticated:
            if my_listings:
                # Dashboard view: Show only MY listings
                return queryset.filter(shop_owner=user)
            elif user.role == 'SHOP_OWNER':
                # Public view for Shop Owner: Show everyone ELSE's listings
                return queryset.filter(is_available=True).exclude(shop_owner=user)
            elif user.role == 'ADMIN':
                return queryset
        
        # Default public view (USER or Anonymous)
        return queryset.filter(is_available=True)
    
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

class AdoptionViewSet(viewsets.ModelViewSet, ResponseMixin):
    queryset = Adoption.objects.select_related(
        'user', 'user__user_profile', 'pet', 'shop_owner', 'shop_owner__shop_profile'
    ).all()
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

    def perform_create(self, serializer):
        pet = serializer.validated_data.get('pet')
        # Assign shop_owner and price from pet's listing or creator
        listing = AdoptionListing.objects.filter(pet=pet, is_available=True).first()
        
        shop_owner = listing.shop_owner if listing else pet.created_by
        price = listing.price if listing else 0.00
        
        # Save adoption
        serializer.save(
            user=self.request.user,
            shop_owner=shop_owner,
            price=price,
        )
        
        # Mark pet as unavailable
        if listing:
            listing.is_available = False
            listing.save()
        
        # Create Notification
        Notification.objects.create(
            user=self.request.user,
            title="Adoption Successful 🎉",
            message=f"Congratulations! You have successfully adopted {pet.name}.",
            notification_type="Adoption_Status"
        )
        
        # Also notify Shop Owner
        Notification.objects.create(
            user=shop_owner,
            title="New Adoption",
            message=f"{self.request.user.username} has adopted {pet.name}.",
            notification_type="Adoption_Status"
        )
