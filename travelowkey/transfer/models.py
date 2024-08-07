from django.db import models
from payment.models import Invoice
import qrcode
from io import BytesIO
from django.core.files import File

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
    QR_code = models.ImageField(upload_to='qr_code/', null=True, blank=True)

    class Meta:
        db_table = 'taxi_invoice'

    def save(self, *args, **kwargs):
        if not self.QR_code:
            super().save(*args, **kwargs)
            qr_content = f"Taxi ID: {self.taxi_id}, Invoice ID: {self.invoice_id}"
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
            file_name = f"taxi_invocie_{self.id}.png"
            self.QR_code.save(file_name, File(buffer), save=False)

        super().save(*args, **kwargs)

class Taxi_type(models.Model):
    id = models.CharField(max_length=5, primary_key=True)
    type = models.CharField(max_length=50)

    class Meta:
        db_table = 'taxi_type'