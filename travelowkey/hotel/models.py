from django.db import models
from payment.models import Invoice
import qrcode
from io import BytesIO
from django.core.files import File

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
    id = models.AutoField(primary_key=True)
    room_id = models.ForeignKey(Room, on_delete=models.CASCADE,db_column='room_id')
    check_in = models.DateField()
    check_out = models.DateField()
    invoice_id = models.ForeignKey(Invoice, on_delete=models.CASCADE,db_column='invoice_id')
    QR_code = models.ImageField(upload_to='qr_code/', null=True, blank=True)

    class Meta:
        db_table = 'room_invoice'
    
    def save(self, *args, **kwargs):
        if not self.QR_code:
            super().save(*args, **kwargs)
            qr_content = f"Room ID: {self.room_id}, Invoice ID: {self.invoice_id}"
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(qr_content)
            qr.make(fit=True)
            img = qr.make_image(fill='black', back_color='white')
            buffer = BytesIO()
            img.save(buffer, format="PNG")
            file_name = f"room_invocie_{self.id}.png"
            self.QR_code.save(file_name, File(buffer), save=False)

        super().save(*args, **kwargs)


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
