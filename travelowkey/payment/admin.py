from django.contrib import admin
from .models import Invoice

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_id', 'total_price')
    search_fields = ('user_id', 'id')
    list_filter = ('total_price',)
