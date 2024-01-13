from django.db import models
from systemusers.models import CustomUser as user
# Create your models here.

class facility(models.Model):
    facilityid =models.AutoField(primary_key=True) 
    dateadded = models.DateField(auto_now_add=True,null=True)      
    facName = models.CharField(max_length=100,null=True)      
    facAbbreviation = models.CharField(max_length=50,null=True)      
    location = models.CharField(max_length=100,null=True)
    phoneNo = models.CharField(max_length=30,null=True)
    email = models.CharField(max_length=100, null=True)    
    stmtHeader = models.CharField(max_length=200, null=True)    
    stmtFooter = models.CharField(max_length=200, null=True)    
    createby = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)
    


class facdepartment(models.Model):
    id =models.AutoField(primary_key=True) 
    dateadded = models.DateTimeField(auto_now_add=True,null=True)      
    deptName = models.CharField(max_length=100,null=True)     
    createby = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)

    def __str__(self):
        return f'{self.deptName}({self.id})'
    
class NurseStation(models.Model):
    id =models.AutoField(primary_key=True) 
    dateadded = models.DateTimeField(auto_now_add=True,null=True)      
    stationName = models.CharField(max_length=100,null=True)     
    createby = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)

    def __str__(self):
        return f'{self.stationName}({self.id})'
    

class Nurse_station_allocation(models.Model):
    entryno=models.AutoField(primary_key=True)
    username=models.ForeignKey(user,null=True, related_name='staff', on_delete=models.DO_NOTHING)
    staitonid=models.ForeignKey(NurseStation,null=True, on_delete=models.DO_NOTHING)
    assignedBy=models.ForeignKey(user,null=True, related_name='user', on_delete=models.DO_NOTHING)

    def __str__(self):
        return f'{self.username.username}({self.staitonid.stationName})'
