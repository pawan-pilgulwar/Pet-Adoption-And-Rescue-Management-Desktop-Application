from django.db import models
from apps.users.models import User
from apps.rescue.models import Report

class ChatRoom(models.Model):
    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='chat_rooms')
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reporter_chat_rooms')
    rescuer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rescuer_chat_rooms')
    
    reporter_marked_completed = models.BooleanField(default=False)
    rescuer_marked_completed = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('report', 'reporter', 'rescuer')
        db_table = 'chat_room'
        ordering = ['-updated_at']

    def __str__(self):
        return f"Rescue room for {self.report.rescue_id} ({self.reporter.username} <-> {self.rescuer.username})"

class Message(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        db_table = 'chat_message'
        ordering = ['created_at']

    def __str__(self):
        return f"Msg from {self.sender.username} in Room {self.room.id}"
