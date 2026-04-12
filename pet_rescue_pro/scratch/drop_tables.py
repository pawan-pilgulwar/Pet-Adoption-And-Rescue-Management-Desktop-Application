import os
import django
import sys

# Add the project root to sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pet_rescue_pro.settings')
django.setup()

from django.db import connection

tables = ['pet_report', 'pet', 'adoption_request', 'notifications', '"user"', 'medical_record']

with connection.cursor() as cursor:
    for table in tables:
        try:
            cursor.execute(f"DROP TABLE IF EXISTS {table} CASCADE")
            print(f"Dropped {table}")
        except Exception as e:
            print(f"Error dropping {table}: {e}")
