from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import User, Passport
from django.contrib.auth.hashers import check_password
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken, BlacklistedToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError
from django.db import transaction, OperationalError
import time
class api_signup(APIView):
    @csrf_exempt
    def post(self, request):
        nation = request.data.get('nation', None)
        expiration = request.data.get('expiration', None)
        checkEmail = User.objects.filter(email=request.data['email'])
        if checkEmail.exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            passport = Passport.objects.create(nation=nation, expiration=expiration)
            user = User.objects.create_user(email=request.data['email'], password=request.data['password'], phone=request.data['phone'], passport_id=passport)
            user.save()
            return Response({'message': 'User created'}, status=status.HTTP_201_CREATED)
        

class get_UserInfo(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        passport = user.passport_id
        user_info = {
            'email': user.email,
            'phone': user.phone,
            'name': user.name,
            'sex': user.sex,
            'birthday': user.birthday,
            'nationality': user.nationality,
            'nation': passport.nation if passport else None,
            'expiration': passport.expiration if passport else None,
        }
        return Response(user_info, status=status.HTTP_200_OK)
    
class update_UserInfo(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request):
        change_fields = request.data.get('keys', [])
        change_values = request.data.get('values',[])
        if len(change_fields) != len(change_values):
            return Response({"error": "Fields and values length mismatch"}, status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        passport_updated = False
        for field, value in zip(change_fields, change_values):
            if hasattr(user, field):
                setattr(user, field, value)
            elif field in ['nation', 'expiration'] and user.passport_id:
                setattr(user.passport_id, field, value)
                passport_updated = True
            else:
                return Response({"error": f"Invalid field: {field}"}, status=status.HTTP_400_BAD_REQUEST)
        user.save()
        if passport_updated:
            user.passport_id.save()

        response = {
            'message': 'User info updated',
            # 'email': user.email,
            # 'phone': user.phone,
            # 'name': user.name,
            # 'sex': user.sex,
            # 'birthday': user.birthday,
            # 'nationality': user.nationality,
            # 'nation': user.passport_id.nation if user.passport_id else None,
            # 'expiration': user.passport_id.expiration if user.passport_id else None,
        }
        return Response(response, status=status.HTTP_200_OK)
    
class update_Pass(APIView):
    permission_classes = [IsAuthenticated]
    def put(seft, request):
        user = request.user
        old_pass = request.data.get('oldPassword', '')
        new_pass = request.data.get('newPassword', '')
        if not check_password(old_pass, user.password):
            return Response({'error': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_pass)
        user.save()
        return Response({'message': 'Cập nhật mật khẩu thành công'}, status=status.HTTP_200_OK)


class Logout(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response({'error': 'Refresh token is required.'}, status=status.HTTP_400_BAD_REQUEST)
            refresh_token_obj = RefreshToken(refresh_token)
            refresh_token_obj.blacklist()
            return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except TokenError as e:
            return Response({'error': 'Token is already blacklisted or invalid.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class check_Login(APIView):
    permission_classes = [IsAuthenticated]
    max_retries = 5
    retry_delay = 1  

    def get(self, request):
        retries = 0
        while retries < self.max_retries:
            try:
                with transaction.atomic():
                    return Response({'message': 'Logged in'}, status=status.HTTP_200_OK)
            except OperationalError as e:
                if e.args[0] == 1213: 
                    retries += 1
                    time.sleep(self.retry_delay) 
                else:
                    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Max retries exceeded due to deadlock'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)