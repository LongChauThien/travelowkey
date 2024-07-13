from django.urls import path
from .views import bus_search

urlpatterns = [
    path('',bus_search,name='bus_search')
]