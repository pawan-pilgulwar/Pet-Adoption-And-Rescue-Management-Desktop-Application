import os
import django
from django.contrib.auth.hashers import check_password

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User

def verify_passwords():
    emails = ['admin@petrescue.in', 'oliverspetstoremumbai735@petshop.in', 'harrisonguha381@gmail.com']
    for email in emails:
        try:
            u = User.objects.get(email=email)
            valid = check_password('User@123', u.password)
            print(f"Email: {email}, Password Valid: {valid}, Role: {u.role}")
        except User.DoesNotExist:
            print(f"Email: {email} NOT FOUND")

if __name__ == "__main__":
    verify_passwords()
