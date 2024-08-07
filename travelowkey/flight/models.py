from django.db import models
from payment.models import Invoice
import qrcode
from io import BytesIO
from django.core.files import File

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
    id = models.AutoField(primary_key=True)
    flight_id = models.ForeignKey(Flight, on_delete=models.CASCADE,db_column='flight_id')
    num_ticket = models.IntegerField()
    invoice_id = models.ForeignKey(Invoice, on_delete=models.CASCADE,db_column='invoice_id')
    QR_code = models.ImageField(upload_to='qr_code/', null=True, blank=True)

    class Meta:
        db_table = 'flight_invoice'
    
    def save(self, *args, **kwargs):
        if not self.QR_code:
            super().save(*args, **kwargs)
            qr_content = f"Flight ID: {self.flight_id}, Invoice ID: {self.invoice_id}"
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
            file_name = f"flight_invocie_{self.id}.png"
            self.QR_code.save(file_name, File(buffer), save=False)

        super().save(*args, **kwargs)