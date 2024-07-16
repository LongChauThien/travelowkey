from django.db import models

class Passport(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    nation = models.CharField(max_length=50, default=None)
    expiration = models.DateField(default=None)

    class Meta:
        db_table = 'passport'
class User(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=50, default=None)
    sex = models.CharField(max_length=10, default=None)
    birthday = models.DateField(default=None)
    phone = models.CharField(max_length=20, default=None)
    email = models.CharField(max_length=50, default=None)
    nationality = models.CharField(max_length=50, default=None)
    passport_id = models.ForeignKey(Passport, on_delete=models.CASCADE, db_column='passport_id')
    password = models.CharField(max_length=50, default=None)

    class Meta:
        db_table = 'user'

