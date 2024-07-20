from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

class account(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return render(request, 'user/account/index.html')

def login(request):
    return render(request, 'user/login/index.html')

def signup(request):
    return render(request, 'user/signup/index.html')