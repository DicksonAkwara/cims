from django.db import models
from MedicalRecords.models import IpVisit,PatientBioData,Schemes
from systemusers.models import CustomUser as user

# Create your models here.

class Security_release(models.Model):
    id= models.AutoField(primary_key=True)
    DateRaised= models.DateTimeField(null=True,auto_now_add=True)
    visitNoIp=models.ForeignKey(IpVisit, on_delete=models.DO_NOTHING, null=True)
    patientno=models.ForeignKey(PatientBioData, on_delete=models.DO_NOTHING, null=True)
    status=models.CharField(max_length=30)
    totalpaid=models.FloatField(max_length=50)
    totalbill=models.FloatField(max_length=50)    
    paymode = models.ForeignKey(Schemes, on_delete=models.DO_NOTHING, null=True)    
    raised_by = models.ForeignKey(user,related_name='raised_by', on_delete=models.DO_NOTHING, null=True)    
    releasedate= models.DateTimeField(null=True)
    nokname=models.CharField(max_length=200, null=True)
    nokid=models.CharField(max_length=50, null=True)
    nokphone=models.CharField(max_length=50, null=True)
    nokrelation=models.CharField(max_length=50, null=True)
    releasedby = models.ForeignKey(user,related_name='release_by', on_delete=models.DO_NOTHING, null=True)

