from django.shortcuts import render
from MedicalRecords.models import *
def consmchpage(request):
    mch=mchClinic.objects.all()   
    context = {
        'mchclinic':mch       
    }    
    return render(request, 'dashboard/mch/mch_consult.html',context)
