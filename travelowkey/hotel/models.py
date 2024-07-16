from django.db import models
from payment.models import Invoice

class Hotel(models.Model):
    id = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=50)
    address = models.CharField(max_length=500)
    area = models.CharField(max_length=100)

    class Meta:
        db_table = 'hotel'

class Room(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    hotel_id = models.ForeignKey(Hotel, on_delete=models.CASCADE,db_column='hotel_id')
    name = models.CharField(max_length=50)
    max = models.IntegerField()
    price = models.IntegerField()
    state = models.CharField(max_length=10)

    class Meta:
        db_table = 'room'

class Room_invoice(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    room_id = models.ForeignKey(Room, on_delete=models.CASCADE,db_column='room_id')
    check_in = models.DateField()
    check_out = models.DateField()
    invoice_id = models.ForeignKey(Invoice, on_delete=models.CASCADE,db_column='invoice_id')

    class Meta:
        db_table = 'room_invoice'


class Service(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=50)

    class Meta:
        db_table = 'service'


class Service_detail(models.Model):
    service_id  = models.ForeignKey(Service, on_delete=models.CASCADE,db_column='service_id')
    room_id = models.ForeignKey(Room, on_delete=models.CASCADE,db_column='room_id')

    class Meta:
        db_table = 'service_detail'
