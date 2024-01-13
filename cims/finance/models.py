from django.db import models
from MedicalRecords.models import *
from stores.models import Store
from farewell.models import farewellRegister


# Create your models here.

class cashierShift(models.Model):
    shiftNo= models.AutoField(primary_key=True)
    start_date= models.DateField(auto_now_add=True, null=True)   
    start_time= models.TimeField(auto_now_add=True,null=True)   
    shift_status=models.CharField(max_length=20)
    close_date= models.DateField(null=True)
    close_time= models.TimeField(null=True)
    cashier = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)


class PatientBill(models.Model):
    ref_number = models.AutoField(primary_key=True)
    bill_date = models.DateTimeField(auto_now_add=True)
    patient_type = models.CharField(max_length=50, null=True)    
    op_number = models.ForeignKey(PatientBioData, on_delete=models.CASCADE, null=True)
    farewell_no = models.ForeignKey(farewellRegister, on_delete=models.CASCADE, null=True)
    wlknumber = models.CharField(max_length=100, null=True)
    visitNo = models.ForeignKey(OpVisits, on_delete=models.CASCADE, null=True)
    visitNoIp = models.ForeignKey(IpVisit, on_delete=models.CASCADE, null=True)
    visitStatus = models.CharField(max_length=50, null=True)
    paymode = models.CharField(max_length=50, null=True)
    bill_point = models.CharField(max_length=50, null=True)
    service = models.ForeignKey(Services, on_delete=models.DO_NOTHING, null=True) #foreign key
    urgency = models.CharField(max_length=50,default='normal', null=True)
    quantity = models.FloatField(null=True)
    total_price = models.FloatField(null=True)
    pay_status = models.CharField(max_length=30,null=True)
    invoice_status = models.CharField(max_length=30,null=True)
    invoice_number = models.CharField(max_length=50,null=True)
    invoice_by= models.ForeignKey(user,related_name='invoice_by', on_delete=models.DO_NOTHING, null=True)
    invoice_date = models.DateTimeField(null=True)
    station = models.ForeignKey(Store,on_delete=models.DO_NOTHING,null=True)
    status = models.CharField(max_length=50, null=True)
    billed_by = models.ForeignKey(user,related_name='svs_provider', on_delete=models.DO_NOTHING, null=True)
    request_by = models.ForeignKey(user,related_name='request_by', on_delete=models.DO_NOTHING, null=True)
    done_by= models.ForeignKey(user,related_name='done_by', on_delete=models.DO_NOTHING, null=True)


class cashierReceipt(models.Model):
    trans_number= models.AutoField(primary_key=True)
    trans_date= models.DateTimeField(auto_now_add=True)
    shift_number = models.ForeignKey(cashierShift, on_delete=models.DO_NOTHING, null=True)
    pat_card=models.ForeignKey(PatientBioData, on_delete=models.DO_NOTHING, null=True)
    billReffNo=models.ForeignKey(PatientBill, on_delete=models.DO_NOTHING, null=True)
    paymode=models.CharField(max_length=20,null=True) #  cash or mobile
    mobile_no=models.CharField(max_length=50,null=True)    
    mobile_trans_no=models.CharField(max_length=50,null=True)    
    receipt_no=models.CharField(max_length=200,null=True)    
    receipt_status=models.CharField(max_length=20,null=True) 
    trans_type=models.CharField(max_length=50, null=True)##cash/mobile/exception/waiver   
    paid_amount= models.FloatField()    
    cashier = models.ForeignKey(user,related_name='cashiereceipt', on_delete=models.DO_NOTHING, null=True)
    """ def save(self,*args,**kwargs):
            if not self.pk:
                next_val=cashierReceipt.objects.raw('select nextval(%s)',['receipt_serial'])
                self.receipt_no=next_val[0].nextval
            super().save(*args,**kwargs) """
    
class receipt_cancel(models.Model):
    id=models.AutoField(primary_key=True)
    cancelled_on=models.DateTimeField(auto_now=True)
    receipt_no=models.CharField(max_length=50,null=True)   
    cancel_reason=models.CharField(max_length=250,null=True) 
    cancelled_by = models.ForeignKey(user,related_name='cancelled_by', on_delete=models.DO_NOTHING, null=True)



class waiverNotes(models.Model):
    id=models.AutoField(primary_key=True)
    notes = models.CharField(max_length=500, null=True)
    patient_no = models.ForeignKey(PatientBioData, on_delete=models.DO_NOTHING, null=True)
    notes_by = models.ForeignKey(user,on_delete=models.DO_NOTHING, null=True)
    notes_date = models.DateTimeField(auto_now_add=True)



class waiver(models.Model):
    waiverNo = models.AutoField(primary_key=True)
    billReffNo=models.ForeignKey(PatientBill, on_delete=models.DO_NOTHING, null=True)
    pat_card=models.ForeignKey(PatientBioData, on_delete=models.DO_NOTHING, null=True)
    vno_op=models.ForeignKey(OpVisits, on_delete=models.DO_NOTHING, null=True)
    vno_ip=models.ForeignKey(IpVisit, on_delete=models.DO_NOTHING, null=True)
    waiver_date= models.DateTimeField(auto_now_add=True)
    waiver_amount = models.FloatField(null=True)
    waived_by =models.ForeignKey(user,related_name='waivedby', on_delete=models.DO_NOTHING, null=True)
    cashier=models.ForeignKey(user,related_name='cashier', on_delete=models.DO_NOTHING, null=True)
    waiver_status=models.CharField(max_length=20) #pending,receipted
    transaction_type=models.CharField(max_length=50, null=True) #waiver or exception
    receipt_no=models.CharField(max_length=50, null=True)
    notesid=models.ForeignKey(waiverNotes,on_delete=models.DO_NOTHING, null=True)    


class patientInvoice(models.Model):
    trans_no=models.AutoField(primary_key=True)
    pat_card=models.ForeignKey(PatientBioData, on_delete=models.DO_NOTHING, null=True)
    invoice_no = models.CharField(max_length=100, null=True)
    serviceReffNo=models.ForeignKey(PatientBill, on_delete=models.DO_NOTHING, null=True)
    service_invoice_price=models.FloatField()
    invoice_by = models.ForeignKey(user,related_name='invoice_settled_by', on_delete=models.DO_NOTHING, null=True)
    invoice_date = models.DateTimeField(auto_now_add=True)


class bill_adjustment(models.Model):
    trans_no=models.AutoField(primary_key=True)
    pat_card=models.ForeignKey(PatientBioData, on_delete=models.DO_NOTHING, null=True)
    service_reff_no=models.ForeignKey(PatientBill, on_delete=models.DO_NOTHING, null=True)
    adj_amount=models.FloatField()
    trans_by=models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)
    trans_date=models.DateTimeField(auto_now_add=True)
    

class cashDeposit(models.Model):
    reffNumber= models.AutoField(primary_key=True)
    DepositDate= models.DateTimeField(null=True,auto_now_add=True)
    pat_card=models.ForeignKey(PatientBioData, on_delete=models.DO_NOTHING, null=True)
    depositAmount = models.FloatField()
    patientType=models.ForeignKey(PatientType, on_delete=models.DO_NOTHING, null=True)
    visitNoOp=models.ForeignKey(OpVisits, on_delete=models.DO_NOTHING, null=True)
    visitNoIp=models.ForeignKey(IpVisit, on_delete=models.DO_NOTHING, null=True)
    balance=models.FloatField()
    staff = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True) 

class preauth_form(models.Model):
    track_no= models.AutoField(primary_key=True)
    DateRaised= models.DateTimeField(null=True,auto_now_add=True)
    pat_card=models.ForeignKey(PatientBioData, on_delete=models.DO_NOTHING, null=True)
    patientType=models.ForeignKey(PatientType, on_delete=models.DO_NOTHING, null=True)
    service = models.ForeignKey(Services, on_delete=models.DO_NOTHING, null=True)
    quant = models.FloatField()
    totalprice = models.FloatField()
    preauth_status=models.CharField(max_length=30)
    scheme = models.ForeignKey(Schemes, on_delete=models.DO_NOTHING, null=True)
    preauth_no=models.CharField(max_length=100)
    visitNoOp=models.ForeignKey(OpVisits, on_delete=models.DO_NOTHING, null=True)
    visitNoIp=models.ForeignKey(IpVisit, on_delete=models.DO_NOTHING, null=True)
    raised_by = models.ForeignKey(user,related_name='raisedby', on_delete=models.DO_NOTHING, null=True)
    verified_by = models.ForeignKey(user,related_name='verifiedby', on_delete=models.DO_NOTHING, null=True)
    DateVerified= models.DateTimeField(null=True)




    ### mpesa models
from django.core.validators import MinValueValidator

class AbstractBaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class MpesaResponseBody(AbstractBaseModel):
    body = models.JSONField()


class Transaction(AbstractBaseModel):
    phonenumber = models.CharField(max_length=100)
    amount = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    receipt_no = models.CharField(max_length=100)

    def __str__(self):
        return self.receipt_no