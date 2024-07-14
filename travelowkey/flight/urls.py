from django.urls import path
from .views import flight_search, flight_results

urlpatterns = [
    path('search', flight_search, name='flight_search'),
    path('results', flight_results, name='flight_results')
]