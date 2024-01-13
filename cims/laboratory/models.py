from django.db import models
from systemusers.models import CustomUser as user

from MedicalRecords.models import *
from consultation.models import *
from stores.models import *
from finance.models import *

# Create your models here.
""" class Lab_Test(models.Model):
    test_code=models.AutoField(primary_key=True)
    test_name = models.CharField(max_length=255)
    normal_rate = models.FloatField()
    scheme_rate = models.FloatField()
    date_added = models.DateField(auto_now_add=True)
    added_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True)
    activation= models.CharField(max_length=100)

 class Lab_requests(models.Model):
    reff_no = models.AutoField(primary_key=True)    
    request_sent_date = models.DateField(auto_now_add=True)    
    request_sent_time=models.TimeField(auto_now_add=True)
    request_rec_date = models.DateField(null=True)    
    request_rec_time=models.TimeField(null=True)    
    op_number = models.ForeignKey(PatientBioData,on_delete=models.DO_NOTHING, null=True)        
    test_code = models.ForeignKey(Lab_Test,on_delete=models.DO_NOTHING, null=True)
    paymode_test_price = models.FloatField()
    pay_mode = models.CharField(max_length=50, null=True)
    invoice_no = models.CharField(max_length=50, null=True)
    receipt_no = models.CharField(max_length=50, null=True)
    received_status = models.CharField(max_length=50, null=True)
    available_status = models.CharField(max_length=50, null=True)
    pay_status = models.CharField(max_length=50, null=True)      
    cashier = models.CharField(max_length=50, null=True)
    request_by = models.ForeignKey(User,on_delete=models.DO_NOTHING, null=True)
    Approved_by = models.CharField(max_length=50, null=True) """


class LabTestParameter(models.Model):
    param_no=models.AutoField(primary_key=True) 
    test_id=models.ForeignKey(Services,on_delete=models.DO_NOTHING, null=True)
    param_name = models.CharField(max_length=100,null=True)
    lower_limit=models.CharField(max_length=100,null=True)
    upper_limit=models.CharField(max_length=100,null=True)
    value_units=models.CharField(max_length=100,null=True)
    posible_result=models.TextField(null=True)
    param_type=models.CharField(max_length=100,null=True)
    status=models.CharField(max_length=20,null=True)
    added_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True)    

    def __str__(self):
        return f'{self.test_id.service_name}({self.param_no})'


class LabResult(models.Model):
    result_no=models.AutoField(primary_key=True)     
    receive_date = models.DateField(auto_now_add=True)
    receive_time = models.TimeField(auto_now_add=True)  
    op_number = models.ForeignKey(PatientBioData,on_delete=models.DO_NOTHING, null=True)
    request_reff_no=models.ForeignKey(PatientBill,on_delete=models.DO_NOTHING, null=True)
    request_service=models.ForeignKey(Services,on_delete=models.DO_NOTHING, null=True)    
    result_value=models.JSONField(default=dict)
    testComment=models.CharField(max_length=255,null=True)
    editReason=models.CharField(max_length=255,null=True)
    results_date = models.DateField(null=True)
    results_time= models.TimeField(null=True)
    exam_status = models.CharField(max_length=100,null=True)
    requestedit_by =models.ForeignKey(user,related_name='editrequestby', on_delete=models.DO_NOTHING, null=True)    
    performed_by =models.ForeignKey(user,related_name='performedby', on_delete=models.DO_NOTHING, null=True)
    confirmed_by = models.ForeignKey(user, related_name='confirmedby', on_delete=models.DO_NOTHING, null=True)
    received_by = models.ForeignKey(user, related_name='receivedby', on_delete=models.DO_NOTHING, null=True)
    sampleNo = models.CharField(max_length=100,null=True)
    VisitNo = models.CharField(max_length=100,null=True)


class LabMissTest(models.Model):
    miss_number =models.AutoField(primary_key=True)
    request_reff_no=models.ForeignKey(PatientBill,on_delete=models.DO_NOTHING, null=True)    
    reason = models.CharField(max_length=200)
    recorded_by = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)

   
class labDepartment(models.Model):
    departmentid =models.AutoField(primary_key=True) 
    DateCreated =models.DateTimeField(auto_now_add=True,null=True)      
    departmentname = models.CharField(max_length=200)
    description = models.CharField(max_length=200)
    createby = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)
    def __str__(self):
        return f'{self.departmentname}'

class LabDepartmentTest(models.Model):
    entryno =models.AutoField(primary_key=True) 
    entryDate =models.DateTimeField(auto_now_add=True,null=True)
    departmentname = models.ForeignKey(labDepartment,on_delete=models.DO_NOTHING, null=True)
    testname = models.ForeignKey(Services,on_delete=models.DO_NOTHING, null=True)
    createby = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)
    def __str__(self):
        return f'{self.testname.service_name}-{self.departmentname.departmentname}'


class labItemRequest(models.Model):
    requestid =models.AutoField(primary_key=True)       
    requestDate =models.DateField(null=True)       
    itemCode = models.ForeignKey(DrugGeneralItem, on_delete=models.DO_NOTHING, null=True) 
    requestQuant = models.FloatField(null=True)
    bench = models.ForeignKey(labDepartment, on_delete=models.DO_NOTHING, null=True)
    requestBy = models.ForeignKey(user, related_name='rqby',on_delete=models.DO_NOTHING, null=True)
    issueQuant = models.FloatField(null=True)
    issuedBy = models.ForeignKey(user, related_name='issby',on_delete=models.DO_NOTHING, null=True)
    issueDate =models.DateField(null=True)







