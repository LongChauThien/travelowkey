from django.urls import path
from .views import payment_flight, payment_hotel, payment_bus, payment_transfer, bill_detail_flight, bill_detail_hotel, bill_detail_bus, bill_detail_transfer

urlpatterns = [
    path('flight/', payment_flight, name='payment_flight'),
    path('hotel/', payment_hotel, name='payment_hotel'),
    path('bus/', payment_bus, name='payment_bus'),
    path('transfer/', payment_transfer, name='payment_transfer'),
    path('bill-detail/flight/', bill_detail_flight, name='bill_detail_flight'),
    path('bill-detail/hotel/', bill_detail_hotel, name='bill_detail_hotel'),
    path('bill-detail/bus/', bill_detail_bus, name='bill_detail_bus'),
    path('bill-detail/transfer/', bill_detail_transfer, name='bill_detail_transfer'),
]