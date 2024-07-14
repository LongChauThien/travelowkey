from django.shortcuts import render

def account(request):
    return render(request, 'user/account/index.html')

def login(request):
    return render(request, 'user/login/index.html')

def signup(request):
    return render(request, 'user/signup/index.html')