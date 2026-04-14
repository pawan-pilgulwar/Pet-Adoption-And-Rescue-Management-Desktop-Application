import urllib.request
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_registration_with_empty_pic():
    url = f"{BASE_URL}/users/register/"
    payload = {
        "username": "testuser_empty_pic_2",
        "email": "testuser_empty_pic_2@example.com",
        "first_name": "Test",
        "last_name": "User",
        "password": "Password123!",
        "role": "USER",
        "address": "123 Test St",
        "phone_number": "1234567890",
        "profile_picture_url": "",
        "profile_picture_public_id": ""
    }
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, method='POST')
    req.add_header('Content-Type', 'application/json')
    
    try:
        with urllib.request.urlopen(req) as response:
            status = response.getcode()
            body = response.read().decode('utf-8')
            print(f"Status Code: {status}")
            print(f"Response Body: {body}")
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code}")
        print(f"Message: {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_registration_with_empty_pic()
