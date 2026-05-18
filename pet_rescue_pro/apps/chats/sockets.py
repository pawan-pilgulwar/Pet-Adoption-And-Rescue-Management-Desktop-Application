import socketio
from rest_framework_simplejwt.tokens import AccessToken
from apps.users.models import User
from .models import ChatRoom, Message
from .serializer import MessageSerializer, ChatRoomSerializer
from apps.rescue.models import Report

sio = socketio.Server(cors_allowed_origins='*')

# In-memory mapping of session IDs to authenticated user IDs
sid_to_user = {}

def get_active_user_ids():
    active_ids = set()
    if not hasattr(sio, 'eio') or not hasattr(sio.eio, 'sockets'):
        return set(sid_to_user.values())
    for sid in list(sid_to_user.keys()):
        if sid not in sio.eio.sockets:
            sid_to_user.pop(sid, None)
        else:
            active_ids.add(sid_to_user[sid])
    return active_ids

def get_user_from_token(token):
    try:
        access_token = AccessToken(token)
        user_id = access_token['user_id']
        return User.objects.get(id=user_id)
    except Exception as e:
        print(f"JWT Token authentication failed: {e}")
        return None

@sio.event
def connect(sid, environ, auth=None):
    print(f"Socket.IO connection attempt: {sid}")
    token = None
    if auth and 'token' in auth:
        token = auth['token']
    elif environ.get('HTTP_AUTHORIZATION'):
        parts = environ['HTTP_AUTHORIZATION'].split()
        if len(parts) == 2 and parts[0].lower() == 'bearer':
            token = parts[1]
            
    if not token:
        # Fallback to cookies
        cookie_header = environ.get('HTTP_COOKIE', '')
        cookies = {}
        for item in cookie_header.split(';'):
            if '=' in item:
                k, v = item.strip().split('=', 1)
                cookies[k] = v
        token = cookies.get('access_token')
            
    if not token:
        # Fallback to query parameters
        query = environ.get('QUERY_STRING', '')
        if query:
            params = dict(q.split('=') for q in query.split('&') if '=' in q)
            token = params.get('token')

    if not token:
        print("No auth token provided. Connection rejected.")
        return False

    user = get_user_from_token(token)
    if not user:
        print("Invalid auth token. Connection rejected.")
        return False

    if user.role not in ['USER', 'SHOP_OWNER']:
        print("Admins cannot join the chat. Connection rejected.")
        return False

    sio.save_session(sid, {
        'user_id': user.id,
        'username': user.username,
        'role': user.role
    })
    sid_to_user[sid] = user.id
    print(f"Socket.IO connection accepted: {sid} for User {user.username}")
    
    # Broadcast to other users that this user is online
    try:
        sio.emit('user_status', {'user_id': user.id, 'status': 'online'})
    except Exception as e:
        print(f"Socket.IO status emit error: {e}")
        
    return True

@sio.event
def disconnect(sid):
    user_id = sid_to_user.get(sid)
    if sid in sid_to_user:
        del sid_to_user[sid]
    print(f"Socket.IO disconnected: {sid}")
    
    # Only broadcast offline if the user has no remaining active sessions
    if user_id and user_id not in sid_to_user.values():
        try:
            sio.emit('user_status', {'user_id': user_id, 'status': 'offline'})
        except Exception as e:
            print(f"Socket.IO status emit error: {e}")

@sio.event
def join_room(sid, data):
    session = sio.get_session(sid)
    user_id = session.get('user_id')
    room_id = data.get('room_id')
    
    try:
        room = ChatRoom.objects.get(id=room_id)
        if room.reporter_id != user_id and room.rescuer_id != user_id:
            return {'status': 'error', 'message': 'Permission denied'}
            
        sio.enter_room(sid, f"room_{room_id}")
        print(f"User {session.get('username')} joined room_{room_id}")
        return {'status': 'success'}
    except ChatRoom.DoesNotExist:
        return {'status': 'error', 'message': 'Room not found'}

@sio.event
def send_message(sid, data):
    session = sio.get_session(sid)
    user_id = session.get('user_id')
    room_id = data.get('room_id')
    content = data.get('content')
    
    try:
        room = ChatRoom.objects.get(id=room_id)
        if room.reporter_id != user_id and room.rescuer_id != user_id:
            return {'status': 'error', 'message': 'Permission denied'}
            
        if room.is_completed:
            return {'status': 'error', 'message': 'Rescue operation is completed. Chat is disabled.'}
            
        sender = User.objects.get(id=user_id)
        message = Message.objects.create(
            room=room,
            sender=sender,
            content=content
        )
        
        room.save() # update room's updated_at
        
        msg_data = MessageSerializer(message).data
        sio.emit('new_message', msg_data, room=f"room_{room_id}")
        return {'status': 'success', 'message': msg_data}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}

@sio.event
def mark_completed(sid, data):
    session = sio.get_session(sid)
    user_id = session.get('user_id')
    room_id = data.get('room_id')
    
    try:
        room = ChatRoom.objects.get(id=room_id)
        if room.reporter_id != user_id and room.rescuer_id != user_id:
            return {'status': 'error', 'message': 'Permission denied'}
            
        if room.is_completed:
            return {'status': 'error', 'message': 'Already completed'}
            
        if room.reporter_id == user_id:
            room.reporter_marked_completed = True
        elif room.rescuer_id == user_id:
            room.rescuer_marked_completed = True
            
        if room.reporter_marked_completed and room.rescuer_marked_completed:
            room.is_completed = True
            # Update report status to Resolved
            report = room.report
            report.status = 'Resolved'
            report.save()
            
        room.save()
        
        room_data = ChatRoomSerializer(room).data
        sio.emit('room_updated', room_data, room=f"room_{room_id}")
        return {'status': 'success', 'room': room_data}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}
