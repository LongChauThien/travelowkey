# Generated by Django 5.0.4 on 2024-08-07 07:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flight', '0004_alter_flight_invoice_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='flight_invoice',
            name='QR_code',
            field=models.ImageField(blank=True, null=True, upload_to='qr_code/'),
        ),
    ]
