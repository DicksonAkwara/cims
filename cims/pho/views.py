from django.shortcuts import render
from django.http import JsonResponse
import json
from MedicalRecords.models import Services,PatientBioData
from finance.models import PatientBill
from systemusers.models import CustomUser
# Create your views here.

def pho_index(request):
    context={}
    return render(request, 'dashboard/pho/pho_index.html',context)

def search_service(request):
    if request.method=='POST':
        data=[]
        sname = json.loads(request.body).get('searchText')
        sql=Services.objects.filter(service_name__icontains=sname,service_type='service',status='Active')[0:10]
        for i in range(len(sql)):
            data.append({
                'sid':sql[i].scode,
                'sname':sql[i].service_name,
                'spoint':sql[i].service_point,
                'nrate':sql[i].normal_rate,
                'srate':sql[i].scheme_rate,
            })
            
        return JsonResponse(data,safe=False)

def raisebill(request):
   if request.method=='POST':
       bill=json.loads(request.body)
       data=[]
       msg=''
       for i in range(len(bill)):
            
            sql=PatientBill()
            sql.patient_type='Out-Patient'
            sql.op_number= PatientBioData.objects.get(op_number=bill[i]["pno"])
            sql.paymode=bill[i]["pym"]
            sql.bill_point=bill[i]["spoint"]
            sql.service=Services.objects.get(scode=bill[i]["scode"])
            sql.quantity=bill[i]["qnt"]
            sql.total_price=bill[i]["ttp"]
            sql.pay_status='billed'
            sql.billed_by=CustomUser.objects.get(id=request.user.id)
            sql.save()
            msg='Request saved successfully'
            data={'msg':msg}

       return JsonResponse(data,safe=False) 

