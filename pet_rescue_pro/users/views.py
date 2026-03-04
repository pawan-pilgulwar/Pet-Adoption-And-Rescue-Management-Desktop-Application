from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from django.db.models import Q

from core.mixins import ResponseMixin
from .models import PetReport, User
from .seralizer import PetReportSerializer, UserWriteSerializer, LoginSerializer, UserReadSerializer
from core.permission import IsAdmin

# Create your views here.
class UserViewSet(viewsets.ModelViewSet, ResponseMixin):
    queryset = User.objects.all()   
    serializer_class = UserWriteSerializer

    #  NEW LOOKUP LOGIC
    def get_object(self):
        lookup = self.kwargs.get("lookup")
        queryset = self.get_queryset()
        return get_object_or_404(
            queryset,
            Q(username=lookup) | Q(email=lookup) | Q(id=lookup)
        )

    
    @action(detail=False, methods=['get'], url_path='', permission_classes=[IsAdmin])
    def get_users(self, request, *args, **kwargs):
        queryset = self.queryset
        serializer = self.serializer_class(queryset, many=True)
        return self.success_response(
            data={
                "count": queryset.count(),
                "users": serializer.data
            },
            message="Users fetched successfully",
            status_code = status.HTTP_200_OK
        )
    

    @action(detail=False, methods=['get'], url_path='me', permission_classes=[IsAuthenticated])
    def get_user(self, request, *args, **kwargs):
        serializer = UserReadSerializer(request.user, context={"request": request})
        return self.success_response(
            data = serializer.data,
            message="User fetched successfully",
            status_code = status.HTTP_200_OK
        )


    @action(detail=False, methods=['post'], url_path='register', permission_classes=[AllowAny])
    def register(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return self.success_response(
            data=serializer.data,
            message="User registered successfully",
            status_code=201
        )
    

    @action(detail=False, methods=['post'], url_path='login', permission_classes=[AllowAny])
    def login(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return self.success_response(
            data=serializer.validated_data,
            message="Login successful",
            status_code=200
        )
        

    @action(detail=True, methods=['put', 'patch'], url_path='update-user', permission_classes=[IsAuthenticated])
    def update_user(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return self.success_response(
            data=serializer.data,
            message="User updated successfully",
            status_code=200
        )
    

    @action(detail=True, methods=['delete'], url_path='delete-user', permission_classes=[IsAdmin | IsAdminUser])
    def delete_user(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return self.success_response(
            data={"deleted_user_id": instance.id},
            message="User deleted successfully",
            status_code=204
        )
    
    @action(detail=False, methods=['patch'], url_path='update-password', permission_classes=[IsAuthenticated])
    def update_password(self, request, *args, **kwargs):
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return self.success_response(
            message="Password updated successfully",
            status_code=200
        )


class PetReportViewSet(viewsets.ModelViewSet):
    queryset = PetReport.objects.all()
    serializer_class = PetReportSerializer

