from urllib import request

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from django.db.models import Q

from .models import Pet, PetReport, User
from .seralizer import PetReportSerializer, UserWriteSerializer, PetSerializer, LoginSerializer, UserReadSerializer

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
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

    
    def list(self, request, *args, **kwargs):
        queryset = self.queryset
        serializer = self.serializer_class(queryset, many=True)
        return Response({
            "success": True,
            "status code": status.HTTP_200_OK, 
            "count": queryset.count(),
            "data": serializer.data,
         }, status=status.HTTP_200_OK)
    

    @action(detail=False, methods=['get'], url_path='me', permission_classes=[IsAuthenticated])
    def get_user(self, request, *args, **kwargs):
        try:
            print("USER:", request.user)
            print("AUTH:", request.auth)

            serializer = UserReadSerializer(request.user, context={"request": request})
            return Response({
                "success": True,
                "status code": status.HTTP_200_OK, 
                "data": serializer.data,
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "success": False,
                "status code": status.HTTP_400_BAD_REQUEST, 
                "message": str(e),
            }, status=status.HTTP_400_BAD_REQUEST)


    @action(detail=False, methods=['post'], url_path='register', permission_classes=[AllowAny])
    def register(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "success": True,
            "status code": status.HTTP_201_CREATED, 
            "message": "User registered successfully",
            "data": serializer.data,
        }, status=status.HTTP_201_CREATED)
    

    @action(detail=False, methods=['post'], url_path='login', permission_classes=[AllowAny])
    def login(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({
            "success": True,
            "status code": status.HTTP_200_OK, 
            "message": "Login successful",
            "data": serializer.validated_data,
        }, status=status.HTTP_200_OK)
        

    @action(detail=True, methods=['put', 'patch'], url_path='update-user', permission_classes=[IsAuthenticated])
    def update_user(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "success": True,
            "status code": status.HTTP_206_PARTIAL_CONTENT if partial else status.HTTP_200_OK, 
            "message": "User updated successfully",
            "data": serializer.data,
        }, status=status.HTTP_206_PARTIAL_CONTENT if partial else status.HTTP_200_OK)
    

    @action(detail=True, methods=['delete'], url_path='delete-user', permission_classes=[IsAdminUser])
    def delete_user(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({
            "success": True,
            "status code": status.HTTP_204_NO_CONTENT,
            "message": "User deleted successfully",
            "deleted user": instance.id,
        }, status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['patch'], url_path='update-password', permission_classes=[IsAuthenticated])
    def update_password(self, request, *args, **kwargs):
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "success": True,
            "status code": status.HTTP_200_OK,
            "message": "Password updated successfully."
        }, status=status.HTTP_200_OK)


class PetViewSet(viewsets.ModelViewSet):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer

class PetReportViewSet(viewsets.ModelViewSet):
    queryset = PetReport.objects.all()
    serializer_class = PetReportSerializer

