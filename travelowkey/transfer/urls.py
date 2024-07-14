from django.urls import path
from .views import transfer_search

urlpatterns = [
    path('',transfer_search, name='transfer_search')
]