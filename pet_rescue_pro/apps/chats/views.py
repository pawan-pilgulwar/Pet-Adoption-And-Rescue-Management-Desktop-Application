from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import ChatRoom, Message
from .serializer import ChatRoomSerializer, MessageSerializer
from apps.rescue.models import Report
from apps.core.mixins import ResponseMixin
from .sockets import sio

class ChatRoomViewSet(viewsets.ModelViewSet, ResponseMixin):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return self.queryset.select_related('report', 'report__pet', 'reporter', 'rescuer').all()
        return self.queryset.filter(Q(reporter=user) | Q(rescuer=user)).select_related('report', 'report__pet', 'reporter', 'rescuer')

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return self.success_response(
            data=serializer.data,
            message="Chat rooms retrieved successfully"
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return self.success_response(
            data=serializer.data,
            message="Chat room retrieved successfully"
        )

    @action(detail=False, methods=['post'], url_path='initiate')
    def initiate(self, request):
        user = request.user
        if user.role not in ['USER', 'SHOP_OWNER']:
            return self.error_response(
                message="Admins cannot participate in chats.",
                status_code=status.HTTP_403_FORBIDDEN
            )

        report_id = request.data.get('report_id')
        if not report_id:
            return self.error_response(
                message="report_id is required.",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        try:
            report = Report.objects.get(id=report_id)
        except Report.DoesNotExist:
            return self.error_response(
                message="Report not found.",
                status_code=status.HTTP_404_NOT_FOUND
            )

        if report.user == user:
            return self.error_response(
                message="You cannot rescue a pet reported by yourself.",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        # Get or create chat room
        room, created = ChatRoom.objects.get_or_create(
            report=report,
            reporter=report.user,
            rescuer=user
        )

        serializer = self.get_serializer(room)
        return self.success_response(
            data=serializer.data,
            message="Chat initiated successfully",
            status_code=status.HTTP_200_OK if not created else status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['get'], url_path='messages')
    def messages(self, request, pk=None):
        room = self.get_object()
        # Mark unread messages as read
        room.messages.filter(is_read=False).exclude(sender=request.user).update(is_read=True)
        
        messages = room.messages.all()
        serializer = MessageSerializer(messages, many=True)
        return self.success_response(data=serializer.data)

    @action(detail=True, methods=['post'], url_path='send')
    def send_message(self, request, pk=None):
        room = self.get_object()
        user = request.user
        
        if room.reporter != user and room.rescuer != user:
            return self.error_response(
                message="You are not authorized to send messages in this room.",
                status_code=status.HTTP_403_FORBIDDEN
            )

        if room.is_completed:
            return self.error_response(
                message="This rescue operation is completed. Sending new messages is disabled.",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        content = request.data.get('content')
        if not content:
            return self.error_response(
                message="Message content is required.",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        message = Message.objects.create(
            room=room,
            sender=user,
            content=content
        )
        
        # Save room to update updated_at
        room.save()

        # Emit over socket.io if server is active
        try:
            msg_data = MessageSerializer(message).data
            sio.emit('new_message', msg_data, room=f"room_{room.id}")
        except Exception as e:
            print(f"Socket emit failed in REST fallback: {e}")

        serializer = MessageSerializer(message)
        return self.success_response(data=serializer.data, status_code=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='complete')
    def complete(self, request, pk=None):
        room = self.get_object()
        user = request.user

        if room.reporter != user and room.rescuer != user:
            return self.error_response(
                message="You are not authorized.",
                status_code=status.HTTP_403_FORBIDDEN
            )

        if room.is_completed:
            return self.error_response(
                message="Already completed.",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        if room.reporter == user:
            room.reporter_marked_completed = True
        elif room.rescuer == user:
            room.rescuer_marked_completed = True

        if room.reporter_marked_completed and room.rescuer_marked_completed:
            room.is_completed = True
            report = room.report
            report.status = 'Resolved'
            report.save()

        room.save()

        # Emit over socket.io
        try:
            room_data = ChatRoomSerializer(room).data
            sio.emit('room_updated', room_data, room=f"room_{room.id}")
        except Exception as e:
            print(f"Socket emit failed in REST fallback: {e}")

        serializer = self.get_serializer(room)
        return self.success_response(data=serializer.data, message="Rescue status updated")
