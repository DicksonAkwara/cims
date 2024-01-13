from django.db import models
from finance.models import PatientBill
from systemusers.models import CustomUser as user
from MedicalRecords.models import PatientBioData
from stores.models import DrugGeneralItem,Store
# Create your models here.

class PharmDispense(models.Model):
    disp_id = models.AutoField(primary_key=True)
    trasdate = models.DateTimeField(auto_now_add=True,null=True)
    patnumber = models.ForeignKey(PatientBioData, on_delete=models.DO_NOTHING, null=True)
    reffno = models.ForeignKey(PatientBill, on_delete=models.DO_NOTHING, null=True) 
    drug_item = models.ForeignKey(DrugGeneralItem, on_delete=models.CASCADE, null=True)
    store= models.ForeignKey(Store, on_delete=models.CASCADE, null=True)  
    dosage=models.CharField(max_length=10,null=True)      
    frequency=models.CharField(max_length=10,null=True)      
    days = models.CharField(max_length=10,null=True)
    quant = models.FloatField()
    total_price = models.FloatField()
    receipt_no= models.CharField(max_length=100,null=True)
    invoice_no= models.CharField(max_length=100,null=True)
    status= models.CharField(max_length=100,null=True)
    DispenseDate = models.DateTimeField(null=True)
    pharmacist = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)    

    def __str__(self):
        return f'{self.patnumber}({self.disp_id})'
