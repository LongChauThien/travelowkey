from django.urls import path
from .views import account, login, signup

urlpatterns = [
    path('account/', account, name='account'),
    path('login/', login, name='login'),
    path('signup/', signup, name='signup'),
]