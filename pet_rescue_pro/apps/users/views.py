from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.contrib.auth.hashers import make_password, check_password
import os

from apps.core.mixins import ResponseMixin
from .models import User
from .serializer import UserWriteSerializer, LoginSerializer, UserReadSerializer
from apps.core.permission import IsAdmin
from apps.rescue.models import Report
from apps.pets.models import Pet 

# Create your views here.
class UserViewSet(viewsets.ModelViewSet, ResponseMixin):
    queryset = User.objects.all()   
    serializer_class = UserReadSerializer

    #  NEW LOOKUP LOGIC
    def get_object(self):
        lookup = self.kwargs.get("pk")
        queryset = self.get_queryset()
        return get_object_or_404(
            queryset,
            Q(username=lookup) | Q(email=lookup) | Q(id=lookup)
        )

    def get_serializer_class(self):
        if self.action == 'login' and self.request.method == 'POST':
            return LoginSerializer
        elif self.request.method == 'POST' or self.request.method == 'PUT' or self.request.method == 'PATCH':
            return UserWriteSerializer
        return UserReadSerializer

    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return self.success_response(
            data={
                "count": queryset.count(),
                "users": serializer.data
            },
            message="Users fetched successfully",
            status_code=status.HTTP_200_OK
        )
    

    @action(detail=False, methods=['get'], url_path='me', permission_classes=[IsAuthenticated])
    def get_user(self, request, *args, **kwargs):
        serializer = self.get_serializer(request.user, context={"request": request})
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
            status_code=status.HTTP_201_CREATED
        )
    

    @action(detail=False, methods=['post'], url_path='login', permission_classes=[AllowAny])
    def login(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        response = self.success_response(
            data=serializer.validated_data,
            message="Login successful",
            status_code=status.HTTP_200_OK
        )

        is_production = os.getenv('ENVIRONMENT') != 'development'

        response.set_cookie(
            key="access_token",
            value=serializer.validated_data['access'],
            httponly=True,
            secure=is_production,
            samesite="None" if is_production else "Lax",
            max_age=3600
        )

        response.set_cookie(
            key="refresh_token",
            value=serializer.validated_data['refresh'],
            httponly=True,
            secure=is_production,
            samesite="None" if is_production else "Lax",
            max_age=86400
        )

        return response

    @action(detail=False, methods=['post'], url_path='logout', permission_classes=[IsAuthenticated])
    def logout(self, request, *args, **kwargs):
        response = self.success_response(
            message="Logout successful",
            status_code=status.HTTP_200_OK
        )

        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        return response
        

    @action(detail=True, methods=['put', 'patch'], url_path='update-user', permission_classes=[IsAuthenticated])
    def update_user(self, request, *args, **kwargs):
        partial = request.method == "PATCH"
        instance = self.get_object()

        if request.user != instance and request.user.role != "admin":
            return self.error_response(
                message="Permission denied",
                status_code=status.HTTP_403_FORBIDDEN
            )
    
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return self.success_response(
            data=serializer.data,
            message="User updated successfully",
            status_code=status.HTTP_200_OK
        )
    

    @action(detail=True, methods=['delete'], url_path='delete-user', permission_classes=[IsAuthenticated])
    def delete_user(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance != request.user:
            return self.error_response(
                message="You can only delete your own account.",
                status_code=status.HTTP_403_FORBIDDEN
            )

        instance.delete()
        return self.success_response(
            data={"deleted_user_id": instance.id},
            message="User deleted successfully",
            status_code=status.HTTP_204_NO_CONTENT
        )
    
    @action(detail=False, methods=['patch'], url_path='update-password', permission_classes=[IsAuthenticated])
    def update_password(self, request, *args, **kwargs):
        user = request.user

        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not old_password or not new_password:
            return self.error_response(
                message="Old password and new password are required",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        if not check_password(old_password, user.password):
            return self.error_response(
                message="Old password is incorrect",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        if new_password != confirm_password:
            return self.error_response(
                message="Passwords do not match",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        if len(new_password) < 8:
            return self.error_response(
                message="Password must be at least 8 characters",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        user.password = make_password(new_password)
        user.save()

        return self.success_response(
            message="Password updated successfully",
            status_code=status.HTTP_200_OK
        )



    # ---------------    ADMIN VIEWS     -------------

    @action(detail=False, methods=['get'], url_path='admin-dashboard', permission_classes=[IsAdmin] )
    def admin_dashboard(self, request):
        from apps.rescue.models import Report, RescueRequest
        from apps.pets.models import Pet 
        from apps.services.models import Service
        from apps.adoption.models import Adoption

        total_users = User.objects.filter(role ="USER").count()
        total_reports = Report.objects.count()
        total_pets = Pet.objects.count()
        total_services = Service.objects.count()
        total_adoptions = Adoption.objects.count()
        total_rescues = RescueRequest.objects.count()

        # Detailed Stats
        pending_reports = Report.objects.filter(status="Pending").count()
        accepted_reports = Report.objects.filter(status="Accepted").count()
        rejected_reports = Report.objects.filter(status="Rejected").count()

        # Recent Activity
        recent_reports = Report.objects.order_by('-created_at')[:5]
        recent_users = User.objects.filter(role="USER").order_by('-created_at')[:5]
        recent_adoptions = Adoption.objects.order_by('-adopted_at')[:5]

        # Serialization for recent items
        from apps.rescue.serializer import ReportSerializer
        from .serializer import UserReadSerializer
        from apps.adoption.serializer import AdoptionSerializer

        report_serializer = ReportSerializer(recent_reports, many=True, context={'request': request})
        user_serializer = UserReadSerializer(recent_users, many=True, context={'request': request})
        adoption_serializer = AdoptionSerializer(recent_adoptions, many=True, context={'request': request})

        data = {
            "total_users": total_users,
            "total_reports": total_reports,
            "total_pets": total_pets,
            "total_services": total_services,
            "total_adoptions": total_adoptions,
            "total_rescues": total_rescues,
            "report_stats": {
                "pending": pending_reports,
                "accepted": accepted_reports,
                "rejected": rejected_reports
            },
            "recent_activity": {
                "reports": report_serializer.data,
                "users": user_serializer.data,
                "adoptions": adoption_serializer.data
            }
        }

        return self.success_response(
            data=data,
            message="Admin dashboard data fetched successfully",
            status_code=status.HTTP_200_OK
        )
    
    @action( detail=False, methods=['get'], url_path='admin-users', permission_classes=[IsAdmin] )
    def admin_users(self, request):

        if request.user.role == "Admin":
            queryset = self.queryset.exclude(id=request.user.id)
        else:
            queryset = self.queryset.filter(role="User")
    
        serializer = self.get_serializer(queryset, many=True)

        return self.success_response(
            data={
                "count": queryset.count(),
                "users": serializer.data
            },
            message="All users fetched successfully",
            status_code=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['delete'], url_path='admin-delete-user', permission_classes=[IsAdmin])
    def admin_delete_user(self, request, pk=None):
        user = self.get_object()
        user.delete()

        return self.success_response(
            data={"deleted_user_id": pk},
            message="User deleted by admin",
            status_code=status.HTTP_204_NO_CONTENT
        )


