from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from django.db.models import Q

from .models import Pet
from .seralizer import PetSerializer
from core.mixins import ResponseMixin

# Create your views here.
class PetViewSet(viewsets.ModelViewSet, ResponseMixin):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer

    @action(detail=False, methods=['get'], url_path='get', permission_classes=[AllowAny])
    def get_all_pets(self, request, *args, **kwargs):
        queryset = self.queryset
        print(queryset)
        serializer = self.serializer_class(queryset, many=True)
        return self.success_response(
            data={
                "count": queryset.count(),
                "Pest": serializer.data
            },
            message="Pets fetched successfully",
            status_code = status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['get'], url_path="pet-detail", permission_classes=[AllowAny])
    def get_pet_detail(self, request, *args, **kwargs):
        pet = self.get_object()
        serializer = self.get_serializer(pet)
        return self.success_response(
            data=serializer.data,
            message="Pet fetched successfully",
            status_code = status.HTTP_200_OK
        )


