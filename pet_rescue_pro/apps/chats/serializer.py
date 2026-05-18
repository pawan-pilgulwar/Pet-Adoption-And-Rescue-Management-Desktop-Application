from rest_framework import serializers
from .models import ChatRoom, Message
from apps.users.serializer import UserReadSerializer
from apps.rescue.serializer import ReportSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    sender_role = serializers.CharField(source='sender.role', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'room', 'sender', 'sender_username', 'sender_role', 'content', 'created_at', 'is_read']
        read_only_fields = ['id', 'sender', 'created_at']

class ChatRoomSerializer(serializers.ModelSerializer):
    reporter = UserReadSerializer(read_only=True)
    rescuer = UserReadSerializer(read_only=True)
    report = ReportSerializer(read_only=True)
    latest_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    reporter_online = serializers.SerializerMethodField()
    rescuer_online = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = [
            'id', 'report', 'reporter', 'rescuer', 
            'reporter_marked_completed', 'rescuer_marked_completed', 
            'is_completed', 'created_at', 'updated_at', 
            'latest_message', 'unread_count',
            'reporter_online', 'rescuer_online'
        ]

    def get_reporter_online(self, obj):
        from .sockets import get_active_user_ids
        return obj.reporter.id in get_active_user_ids()

    def get_rescuer_online(self, obj):
        from .sockets import get_active_user_ids
        return obj.rescuer.id in get_active_user_ids()

    def get_latest_message(self, obj):
        latest = obj.messages.order_by('-created_at').first()
        if latest:
            return MessageSerializer(latest).data
        return None

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.messages.filter(is_read=False).exclude(sender=request.user).count()
        return 0
