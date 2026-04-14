from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import Pet
from .serializer import PetSerializer
from apps.core.mixins import ResponseMixin
from apps.core.permission import IsAdmin
from apps.notifications.models import Notification
from apps.users.models import User

class PetViewSet(viewsets.ModelViewSet, ResponseMixin):
    queryset = Pet.objects.all().exclude(Q(status='Found') | Q(status='Lost'))
    serializer_class = PetSerializer

    @action(detail=False, methods=['get'], url_path='all-pets', permission_classes=[IsAuthenticated])
    def get_all_pets(self, request, *args, **kwargs):
        status_param = request.query_params.get('status')
        # Unified filter: show pets marked Available OR pets from Accepted reports
        queryset = Pet.objects.filter(
            Q(status='Available') | Q(reports__status='Accepted')
        ).distinct()
        
        if status_param:
            queryset = queryset.filter(status=status_param)
            
        serializer = self.serializer_class(queryset, many=True)
        return self.success_response(
            data={
                "count": queryset.count(),
                "Pets": serializer.data
            },
            message="Pets fetched successfully",
            status_code = status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['get'], url_path="pet-detail", permission_classes=[IsAuthenticated])
    def get_pet_detail(self, request, *args, **kwargs):
        pet = self.get_object()
        serializer = self.get_serializer(pet)
        return self.success_response(
            data=serializer.data,
            message="Pet fetched successfully",
            status_code = status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'], url_path='search', permission_classes=[IsAuthenticated])
    def search_pets(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(status='Available')
        
        # Get query params
        species = request.query_params.get('species')
        breed = request.query_params.get('breed')
        color = request.query_params.get('color')

        # Apply filters dynamically
        if species:
            queryset = queryset.filter(species__icontains=species)

        if breed:
            queryset = queryset.filter(breed__icontains=breed)

        if color:
            queryset = queryset.filter(color__icontains=color)

        serializer = self.get_serializer(queryset, many=True)

        return self.success_response(
            data={
                "Count": queryset.count(),
                "Pets": serializer.data
            },
            message="Pets fetched successfully",
            status_code=status.HTTP_200_OK
        )

    # ---------------    Admin Views     -----------------------

    @action(detail=False, methods=['get'], url_path='admin-all-pets', permission_classes=[IsAuthenticated, IsAdmin])
    def get_all_pets_admin(self, request, *args, **kwargs):
        queryset = Pet.objects.all()
        serializer = self.get_serializer(queryset, many=True)
        return self.success_response(
            data={
                "count": queryset.count(),
                "pets": serializer.data
            },
            message="Pets fetched successfully",
            status_code = status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['post'], url_path="admin-register-pet", permission_classes=[IsAuthenticated, IsAdmin])
    def register_pet(self, request, *args, **kwrags):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception = True)
        pet = serializer.save()

        users = User.objects.filter(role="User")
        for user in users:
            Notification.objects.create(
                user=user,
                notification_type="Pet_Registration",
                title="New Pet Registered",
                message=f"New pet registered by {pet.created_by.username} for {pet.name}",
                pet=pet
            )

        return self.success_response(
            data=serializer.data,
            message="Pet Registered Successfully",
            status_code = status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['put', 'patch'], url_path='admin-update-pet', permission_classes=[IsAuthenticated, IsAdmin])
    def update_pet(self, request, *args, **kwrags):
        partial = request.method == "PATCH"
        instance = self.get_object()
        serializer = self.get_serializer(instance, data = request.data, partial = partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return self.success_response(
            data=serializer.data,
            message="Pet updated successfully",
            status_code=status.HTTP_202_ACCEPTED
        )
    
    @action(detail=True, methods=['delete'], url_path='admin-delete-pet', permission_classes=[IsAuthenticated, IsAdmin])
    def delete_pet(self, request, *args, **kwargs):
        instance = self.get_object()
        pet_id = instance.id
        instance.delete()
        return self.success_response(
            data={"deleted_pet_id": pet_id},
            message="Pet deleted successfully",
            status_code=status.HTTP_204_NO_CONTENT
        )
