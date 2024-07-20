from django.urls import path
from .views import account, login, signup
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .apis import api_signup, get_UserInfo

urlpatterns = [
    path('account', account.as_view(), name='account'),
    path('login', login, name='login'),
    path('signup', signup, name='signup'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/signup/', api_signup.as_view(), name='api_signup'),
    path('api/user_info/', get_UserInfo.as_view(), name='api_user_info'),
]