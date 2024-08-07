from django.urls import path
from .views import flight_search, flight_results
from .apis import get_locations, get_flights, get_recom_flight

urlpatterns = [
    path('search', flight_search, name='flight_search'),
    path('results', flight_results, name='flight_results'),
    path('api/locations', get_locations, name='get_locations'),
    path('api/flights', get_flights, name='get_flights'),
    path('api/recom-flight', get_recom_flight, name='get_recom_flight')
]