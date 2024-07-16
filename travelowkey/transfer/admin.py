from django.contrib import admin
from .models import Taxi, Taxi_area, Taxi_area_detail, Taxi_invoice, Taxi_type

@admin.register(Taxi)
class TaxiAdmin(admin.ModelAdmin):
    list_display = ('id', 'type_id', 'name', 'luggage', 'num_of_seat', 'price', 'state')
    search_fields = ('name', 'state')
    list_filter = ('state',)

@admin.register(Taxi_area)
class TaxiAreaAdmin(admin.ModelAdmin):
    list_display = ('id', 'pick_point')
    search_fields = ('pick_point',)

@admin.register(Taxi_area_detail)
class TaxiAreaDetailAdmin(admin.ModelAdmin):
    list_display = ('pick_point_id', 'taxi_id')
    search_fields = ('pick_point_id', 'taxi_id')

@admin.register(Taxi_invoice)
class TaxiInvoiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'taxi_id', 'departure_day', 'time_start', 'arrival_day', 'time_end', 'invoice_id')
    search_fields = ('taxi_id', 'invoice_id')
    list_filter = ('departure_day', 'arrival_day')

@admin.register(Taxi_type)
class TaxiTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'type')
    search_fields = ('type',)
