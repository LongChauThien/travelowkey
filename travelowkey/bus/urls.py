from django.urls import path
from .views import bus_search, bus_result
from .apis import get_locations,get_tickets, get_recom_bus
urlpatterns = [
    path('search',bus_search,name='bus_search'),
    path('results',bus_result,name='bus_result'),
    path('api/locations',get_locations,name='bus_locations'),
    path('api/tickets',get_tickets,name='bus_tickets'),
    path('api/recom-bus',get_recom_bus,name='bus_recom')
]