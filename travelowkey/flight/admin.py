from django.contrib import admin
from .models import Flight, Flight_invoice

@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    list_display = ('id', 'from_location', 'to_location', 'date', 'departure_time', 'arrival_time', 'travel_time', 'stop_direct', 'name', 'seat_class', 'num_seat', 'price')
    search_fields = ('from_location', 'to_location', 'name')
    list_filter = ('date', 'from_location', 'to_location')

@admin.register(Flight_invoice)
class FlightInvoiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'flight_id', 'num_ticket', 'invoice_id')
    search_fields = ('flight_id', 'invoice_id')
    list_filter = ('num_ticket',)
