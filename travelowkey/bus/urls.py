from django.urls import path
from .views import bus_search, bus_result

urlpatterns = [
    path('search/',bus_search,name='bus_search'),
    path('results/',bus_result,name='bus_result')
]