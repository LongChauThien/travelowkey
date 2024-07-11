from django.urls import path
from .views import flight_search

urlpatterns = [
    path('', flight_search, name='flight_search')
]