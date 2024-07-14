from django.urls import path
from .views import transfer_search, transfer_results

urlpatterns = [
    path('search/',transfer_search, name='transfer_search'),
    path('results/',transfer_results, name='transfer_results')
]