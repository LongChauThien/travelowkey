from django.urls import path
from .views import payment_flight, payment_hotel, payment_bus, payment_transfer, bill_detail_flight, bill_detail_hotel, bill_detail_bus, bill_detail_transfer
from .apis import get_FlightInfo, flight_Payment, get_BusInfo, bus_Payment, get_TaxiInfo, taxi_Payment, get_RoomInfo, room_Payment, load_Bill, get_Bill, get_FlightBillDetail, get_BusBillDetail, get_TaxiBillDetail, get_RoomDetail
urlpatterns = [
    path('flight/', payment_flight, name='payment_flight'),
    path('hotel/', payment_hotel, name='payment_hotel'),
    path('bus/', payment_bus, name='payment_bus'),
    path('transfer/', payment_transfer, name='payment_transfer'),
    path('bill-detail/flight', bill_detail_flight, name='bill_detail_flight'),
    path('bill-detail/hotel', bill_detail_hotel, name='bill_detail_hotel'),
    path('bill-detail/bus', bill_detail_bus, name='bill_detail_bus'),
    path('bill-detail/transfer', bill_detail_transfer, name='bill_detail_transfer'),
    path('api/flight', get_FlightInfo.as_view(), name='flight_info'),
    path('api/flight_invoice/', flight_Payment.as_view(), name='flight_payment'),
    path('api/bus', get_BusInfo.as_view(), name='bus_info'),
    path('api/bus_invoice/', bus_Payment.as_view(), name='bus_payment'),
    path('api/taxi', get_TaxiInfo.as_view(), name='taxi_info'),
    path('api/taxi_invoice/', taxi_Payment.as_view(), name='taxi_payment'),
    path('api/room', get_RoomInfo.as_view(), name='room_info'),
    path('api/room_invoice/', room_Payment.as_view(), name='room_payment'),
    path('api/load_bill/', load_Bill.as_view(), name='load_bill'),
    path('api/get_bill', get_Bill.as_view(), name='get_bill'),
    path('api/bill-detail/flight', get_FlightBillDetail.as_view(), name='get_flight_bill_detail'),
    path('api/bill-detail/bus', get_BusBillDetail.as_view(), name='get_bus_bill_detail'),
    path('api/bill-detail/transfer', get_TaxiBillDetail.as_view(), name='get_taxi_bill_detail'),
    path('api/bill-detail/hotel', get_RoomDetail.as_view(), name='get_room_detail'),
]