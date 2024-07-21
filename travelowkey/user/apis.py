from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import User
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt

class api_signup(APIView):
    @csrf_exempt
    def post(self, request):
        checkEmail = User.objects.filter(email=request.data['email'])
        if checkEmail.exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            user = User.objects.create_user(email=request.data['email'], password=request.data['password'], phone=request.data['phone'])
            user.save()
            return Response({'message': 'User created'}, status=status.HTTP_201_CREATED)
        

class get_UserInfo(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        user_info = {
            'email': user.email,
            'phone': user.phone,
            'name': user.name,
            'sex': user.sex,
            'birthday': user.birthday,
            'nationality': user.nationality,
            'passport_id': user.passport_id,
        }
        return Response(user_info, status=status.HTTP_200_OK)
    
class update_UserInfo(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request):
        response = {
            "data": request.data,
        }
        return Response(response, status=status.HTTP_200_OK)