from django.urls import path
from .views import hotel_search, hotel_results

urlpatterns = [
    path('search/', hotel_search, name='hotel_search'),
    path('results/', hotel_results, name='hotel_results')
]