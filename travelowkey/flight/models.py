from django.db import models
from payment.models import Invoice

class Flight(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    from_location = models.CharField(max_length=50)
    to_location = models.CharField(max_length=50)
    date = models.DateField()
    departure_time = models.CharField(max_length=10)
    arrival_time = models.CharField(max_length=10)
    travel_time = models.CharField(max_length=20)
    stop_direct = models.CharField(max_length=50)
    name = models.CharField(max_length=50)
    seat_class = models.CharField(max_length=50)
    num_seat = models.IntegerField()
    price = models.IntegerField()

    class Meta:
        db_table = 'flight'

class Flight_invoice(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    flight_id = models.ForeignKey(Flight, on_delete=models.CASCADE,db_column='flight_id')
    num_ticket = models.IntegerField()
    invoice_id = models.ForeignKey(Invoice, on_delete=models.CASCADE,db_column='invoice_id')

    class Meta:
        db_table = 'flight_invoice'