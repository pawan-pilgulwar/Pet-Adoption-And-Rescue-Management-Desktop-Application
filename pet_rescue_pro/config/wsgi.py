"""
WSGI config for pet_rescue_pro project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os
import socketio
from django.core.wsgi import get_wsgi_application
from apps.chats.sockets import sio

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

django_app = get_wsgi_application()
application = socketio.WSGIApp(sio, django_app)
