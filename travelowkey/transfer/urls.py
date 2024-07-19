from django.urls import path
from .views import transfer_search, transfer_results
from .apis import get_locations , get_taxis

urlpatterns = [
    path('search',transfer_search, name='transfer_search'),
    path('results',transfer_results, name='transfer_results'),
    path('api/locations', get_locations, name='get_locations'),
    path('api/taxis', get_taxis, name='get_taxis'),
]