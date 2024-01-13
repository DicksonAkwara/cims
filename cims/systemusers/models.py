from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    user_departments=(
        ('medical_records','medical_records'),
        ('consultation','consultation'),
        ('nursing','nursing'),
        ('finance','finance'),
        ('laboratory','laboratory'),
        ('radiology','radiology'),
        ('pharmacy','pharmacy'),
        ('stores','stores'),
        ('farewell','farewell'),
        ('Security','Security'),
        ('Human_resource','Human_resource'),
        ('Public_health','Public_health'),
        ('Administration','Administration'),
    )
    user_type=(
        ('System_Admin','System_Admin'),
        ('General_Manager','General_Manager'),
        ('Department_Head','Department_Head'),
        ('Department_User','Department_User'),
    )

    fullname = models.CharField(max_length=250, blank=True)
    national_Id_No = models.CharField(max_length=250, blank=True)
    phone = models.CharField(max_length=100, blank=True)
    department = models.CharField(choices=user_departments,max_length=100, blank=True)
    user_type = models.CharField(choices=user_type,max_length=100, blank=True)