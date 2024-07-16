from django.contrib import admin
from .models import Hotel, Room, Room_invoice, Service, Service_detail

@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'address', 'area')
    search_fields = ('name', 'area')
    list_filter = ('area',)

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('id', 'hotel_id', 'name', 'max', 'price', 'state')
    search_fields = ('name', 'state')
    list_filter = ('state',)

@admin.register(Room_invoice)
class RoomInvoiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'room_id', 'check_in', 'check_out', 'invoice_id')
    search_fields = ('room_id', 'invoice_id')
    list_filter = ('check_in', 'check_out')

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Service_detail)
class ServiceDetailAdmin(admin.ModelAdmin):
    list_display = ('service_id', 'room_id')
    search_fields = ('service_id', 'room_id')