from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken
from apps.users.models import User

class CustomJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        # 1. Try to get token from cookies first (browser requests)
        token = request.COOKIES.get('access_token')

        # 2. If no cookie, try Authorization header (Postman / mobile apps)
        if not token:
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return None

            try:
                prefix, token = auth_header.split()
                if prefix.lower() != 'bearer':
                    return None
            except ValueError:
                return None

        # 3. Decode and validate the token
        try:
            decoded_token = AccessToken(token)
            user_id = decoded_token['user_id']
        except Exception:
            raise AuthenticationFailed("Invalid or expired token")

        # 4. Get the user
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise AuthenticationFailed("User not found")
        
        return (user, token)
