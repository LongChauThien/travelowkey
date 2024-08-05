from django.db import models
from user.models import User
class Invoice(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
    total_price = models.IntegerField()

    class Meta:
        db_table = 'invoice'
