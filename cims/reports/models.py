from django.db import models
from systemusers.models import CustomUser as user
from sysadmin.models import facdepartment
# Create your models here.

class deptReport(models.Model):
    id =models.AutoField(primary_key=True) 
    dateadded = models.DateTimeField(auto_now_add=True,null=True)      
    departmentName = models.ForeignKey(facdepartment,on_delete=models.DO_NOTHING,null=True) 
    reportName = models.CharField(max_length=100,null=True)    
    description = models.CharField(max_length=200,null=True)    
    createby = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)

    def __str__(self):
        return f'{self.reportName}({self.departmentName.deptName})({self.id})'