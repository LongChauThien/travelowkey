from django.urls import path
from .views import hotel_search, hotel_results
from .apis import get_locations, get_rooms

urlpatterns = [
    path('search', hotel_search, name='hotel_search'),
    path('results', hotel_results, name='hotel_results'),
    path('api/locations', get_locations, name='get_locations'),
    path('api/rooms/', get_rooms, name='get_rooms'),
]