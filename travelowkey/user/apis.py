from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import User, Passport
from django.contrib.auth.hashers import check_password
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken

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
        return Response({'message': 'Password updated'}, status=status.HTTP_200_OK)


class Logout(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class check_Login(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({'message': 'Logged in'}, status=status.HTTP_200_OK)