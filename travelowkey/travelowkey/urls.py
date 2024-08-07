from django.contrib import admin
from django.urls import path, include 
from django.conf.urls.static import static
from django.conf import settings
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('homepage.urls')),
    path('flight/', include('flight.urls')),
    path('hotel/', include('hotel.urls')),
    path('bus/', include('bus.urls')),
    path('transfer/', include('transfer.urls')),
    path('user/', include('user.urls')),
    path('payment/', include('payment.urls')),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)