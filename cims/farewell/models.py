from django.db import models
from MedicalRecords.models import PatientBioData
from systemusers.models import CustomUser as user

# Create your models here.


class farewellRegister(models.Model):
    registerDate = models.DateField(auto_now_add=True)    
    id = models.AutoField(primary_key=True)
    BodyID = models.CharField(max_length=100, null=True)
    tagNo = models.CharField(max_length=100, null=True)
    hospitalNo = models.ForeignKey(PatientBioData,on_delete=models.DO_NOTHING, null=True)
    fullname = models.CharField(max_length=200, null=True)
    dcIdno = models.PositiveIntegerField(null=True)
    dcAge = models.PositiveIntegerField(null=True)
    dcGender = models.CharField(max_length=20, null=True)    
    dcResidence = models.CharField(max_length=100, null=True)
    nokName = models.CharField(max_length=200, null=True)
    nokPhone = models.PositiveIntegerField(null=True)
    nokId = models.PositiveIntegerField(null=True)
    nokRelation = models.CharField(max_length=100, null=True)
    nokResidence = models.CharField(max_length=100, null=True)
    deathDate = models.DateField(null=True)
    obNumber = models.CharField(max_length=50, null=True)
    notes = models.CharField(max_length=250, null=True)
    status = models.CharField(max_length=50, null=True)
    billStatus = models.CharField(max_length=50, null=True)
    staff = models.ForeignKey(user, on_delete=models.CASCADE, null=True)

