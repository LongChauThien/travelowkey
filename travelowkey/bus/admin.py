from django.contrib import admin
from .models import Bus, Bus_invoice

@admin.register(Bus)
class BusAdmin(admin.ModelAdmin):
    list_display = ('id', 'from_location', 'to_location', 'date', 'departure_time', 'arrival_time', 'travel_time', 'pick_point', 'des_point', 'name', 'seat_count', 'num_seat', 'price')
    search_fields = ('from_location', 'to_location', 'name')
    list_filter = ('date', 'from_location', 'to_location')

@admin.register(Bus_invoice)
class BusInvoiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'bus_id', 'num_ticket', 'invoice_id')
    search_fields = ('bus_id', 'invoice_id')
    list_filter = ('num_ticket',)