from rest_framework.response import Response

class ResponseMixin:

    def success_response(self, data=None, message="Success", status_code=200):
        return Response({
            "success": True,
            "status_code": status_code,
            "message": message,
            "data": data
        }, status=status_code)

    def error_response(self, message="Something went wrong", status_code=400):
        return Response({
            "success": False,
            "status_code": status_code,
            "message": message,
            "data": None
        }, status=status_code)