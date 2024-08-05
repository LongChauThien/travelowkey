from django.db import models
from payment.models import Invoice
class Taxi(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    type_id = models.ForeignKey('Taxi_type', on_delete=models.CASCADE,db_column='type_id')
    name = models.CharField(max_length=50)
    luggage = models.CharField(max_length=20)
    num_of_seat = models.CharField(max_length=20)
    price = models.IntegerField()
    state = models.CharField(max_length=10)

    class Meta:
        db_table = 'taxi'

class Taxi_area(models.Model):
    id = models.AutoField(primary_key=True)
    pick_point = models.CharField(max_length=100)

    class Meta:
        db_table = 'taxi_area'


class Taxi_area_detail(models.Model):
    pick_point_id = models.ForeignKey(Taxi_area, on_delete=models.CASCADE,db_column='pick_point_id')
    taxi_id = models.ForeignKey(Taxi, on_delete=models.CASCADE,db_column='taxi_id')

    class Meta:
        db_table = 'taxi_area_detail'

class Taxi_invoice(models.Model):
    id = models.AutoField(primary_key=True)
    taxi_id = models.ForeignKey(Taxi, on_delete=models.CASCADE,db_column='taxi_id')
    departure_day = models.DateField()
    time_start = models.CharField(max_length=20)
    arrival_day = models.DateField()
    time_end = models.CharField(max_length=20)
    invoice_id = models.ForeignKey(Invoice, on_delete=models.CASCADE,db_column='invoice_id')

    class Meta:
        db_table = 'taxi_invoice'

class Taxi_type(models.Model):
    id = models.CharField(max_length=5, primary_key=True)
    type = models.CharField(max_length=50)

    class Meta:
        db_table = 'taxi_type'