from django.db import models
from user.models import User
from django.utils import timezone

class Invoice(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
    total_price = models.IntegerField()
    create_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'invoice'
