from django.db import models
from systemusers.models import CustomUser as User
from MedicalRecords.models import *
from datetime import date,datetime
# Create your models here.
from finance.models import *

class ExamResult(models.Model):
    exam_no=models.AutoField(primary_key=True)     
    receive_date = models.DateField(auto_now_add=True)
    receive_time = models.TimeField(auto_now_add=True)  
    op_number = models.ForeignKey(PatientBioData,on_delete=models.DO_NOTHING, null=True)
    request_reff_no=models.ForeignKey(PatientBill,on_delete=models.DO_NOTHING, null=True)
    request_service=models.ForeignKey(Services,on_delete=models.DO_NOTHING, null=True)
    exam_notes=models.TextField(null=True)
    exam_notes_date = models.DateField(null=True)
    exam_notes_time= models.TimeField(null=True)
    exam_status = models.CharField(max_length=100)
    notes_by = models.ForeignKey(User, related_name='radiologist', on_delete=models.DO_NOTHING, null=True)
    received_by = models.ForeignKey(User,related_name='receptionist', on_delete=models.DO_NOTHING, null=True)
    VisitNo = models.CharField(max_length=100,null=True)
    uuid_no = models.CharField(max_length=200,null=True)
    radtech = models.CharField(max_length=50,null=True)

class ExamMiss(models.Model):    
    miss_number =models.AutoField(primary_key=True)
    request_reff_no=models.ForeignKey(PatientBill,on_delete=models.DO_NOTHING, null=True)    
    reason = models.CharField(max_length=200)
    recorded_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True)

class examnotes(models.Model):    
    id =models.AutoField(primary_key=True)
    radnotes=models.TextField(max_length=400)