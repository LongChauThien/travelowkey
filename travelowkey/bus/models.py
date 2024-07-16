from django.db import models
from payment.models import Invoice

class Bus(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    from_location = models.CharField(max_length=50)
    to_location = models.CharField(max_length=50)
    date = models.DateField()
    departure_time = models.CharField(max_length=10)
    arrival_time = models.CharField(max_length=10)
    travel_time = models.CharField(max_length=20)
    pick_point = models.CharField(max_length=100)
    des_point = models.CharField(max_length=100)
    name = models.CharField(max_length=50)
    seat_count = models.CharField(max_length=50)
    num_seat = models.IntegerField()
    price = models.IntegerField()

    class Meta:
        db_table = 'bus'

class Bus_invoice(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    bus_id = models.ForeignKey(Bus, on_delete=models.CASCADE,db_column='bus_id')
    num_ticket = models.IntegerField()
    invoice_id = models.ForeignKey(Invoice, on_delete=models.CASCADE,db_column='invoice_id')

    class Meta:
        db_table = 'bus_invoice'