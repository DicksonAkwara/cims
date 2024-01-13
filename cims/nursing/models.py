from django.db import models
from MedicalRecords.models import *
from systemusers.models import CustomUser as User


class Triage(models.Model):
    triage_reff_no = models.AutoField(primary_key=True)
    triage_date = models.DateField(auto_now_add=True)
    triage_time = models.TimeField(auto_now_add=True)    
    op_number = models.ForeignKey(PatientBioData, on_delete=models.DO_NOTHING, null=True)
    temperature = models.FloatField(null=True)
    urgency = models.CharField(max_length=30, null=True)
    blood_pressure = models.CharField(max_length=100, null=True) 
    pulse_rate = models.CharField(max_length=100, null=True) 
    muac = models.CharField(max_length=100, null=True) 
    blood_oxygen = models.CharField(max_length=100, null=True) 
    pat_status = models.CharField(max_length=100, null=True) 
    nurse_notes = models.CharField(max_length=200, null=True) 
    weight = models.FloatField(null=True)
    height = models.FloatField(null=True)
    visitno = models.ForeignKey(OpVisits, on_delete=models.DO_NOTHING, null=True)
    ipvisitno = models.ForeignKey(IpVisit, on_delete=models.DO_NOTHING, null=True)
    staff = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True)



class Cardex(models.Model):
    reffNo = models.AutoField(primary_key=True)
    cardexDate = models.DateField()
    cardexTime = models.TimeField()    
    patNo = models.ForeignKey(PatientBioData, on_delete=models.DO_NOTHING, null=True)
    visitNo = models.ForeignKey(IpVisit, on_delete=models.DO_NOTHING, null=True)
    notes = models.CharField(max_length=250, null=True) 
    recordDate=models.DateTimeField(auto_now_add=True)   
    editDate=models.DateTimeField(auto_now_add=True,null=True)   
    editedBy = models.ForeignKey(User,related_name='editby', on_delete=models.DO_NOTHING, null=True)
    nurse = models.ForeignKey(User,related_name='nurse', on_delete=models.DO_NOTHING, null=True)

