from django.contrib import admin
from .models import User, Passport

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'sex', 'birthday', 'email',  'phone', 'nationality', 'passport_id', 'password')
    search_fields = ('name', 'email', 'phone')
    list_filter = ('name', 'sex')

@admin.register(Passport)
class PassportAdmin(admin.ModelAdmin):
    list_display = ('id', 'nation', 'expiration')
    search_fields = ('id', 'nation')
    list_filter = ('nation', 'expiration')