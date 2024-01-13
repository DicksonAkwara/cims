from django.shortcuts import render
from systemusers.models import CustomUser 
from .models import *
from MedicalRecords.models import Residence,relationship
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from datetime import date, timedelta,datetime
from finance.models import PatientBill
import json
# Create your views here.

@login_required
def fwindex(request):
    context={}   
    return render(request, 'dashboard/farewell/fwdash.html', context)

@login_required
def bdregister(request):
    rel=relationship.objects.all().order_by('relName')
    context={
        'relation':rel
    }   
    return render(request, 'dashboard/farewell/bdregistration.html', context)

@login_required
def bddispatch(request):
    rel=relationship.objects.all().order_by('relName')
    county=Residence.objects.all().distinct('county_name').order_by('county_name')
    context={
        'county':county,
        'relation':rel,
    }   
    return render(request, 'dashboard/farewell/bdispatch.html', context)

def bodyregister(request):
    if request.method=='POST':
        year=datetime.now().strftime('%Y')[2:]
        data={}
        query=farewellRegister()
        query.fullname=request.POST.get('fullname')
        query.dcIdno=request.POST.get('idno')
        query.dcAge=request.POST.get('age')
        query.dcGender=request.POST.get('gender')  
        query.dcResidence=request.POST.get('residence')
        query.nokName=request.POST.get('nkfullname')
        query.nokId=request.POST.get('nkidno')
        query.nokPhone=request.POST.get('nkphone')
        query.nokRelation =request.POST.get('relation') 
        query.nokResidence=request.POST.get('nkresidence')
        query.tagNo=request.POST.get('tagno')
        query.deathDate=request.POST.get('dod')
        query.obNumber=request.POST.get('obnumber')
        query.notes=request.POST.get('notes')
        query.billStatus='pending'
        query.status='active'
        query.staff=user.objects.get(id=request.user.id)
        query.save()
        lastId=query.pk

        btype=request.POST.get('bdtype')
        hospno=request.POST.get('hpno')        
        
        sql=farewellRegister.objects.get(id=lastId)
        bno=btype+str(lastId)+'/'+str(year)
        if hospno !='':
            sql.hospitalNo=PatientBioData.objects.get(patient_no=hospno)
        
        sql.BodyID=bno
        sql.save()
        data={'msg':'Recorded successfully','id':bno}

        return JsonResponse(data,safe=False)


@login_required
def fwbill(request):
    context={}   
    return render(request, 'dashboard/farewell/fwbilling.html', context)

@login_required
def fwnames(request):
    context={}   
    return render(request, 'dashboard/farewell/fwbilling.html', context)


@login_required
def searchbody(request): ### able to get username from the userid
    if request.method=='POST':
        stext=json.loads(request.body).get('searchText')
        result=farewellRegister.objects.filter(BodyID__icontains=stext)[0:5] | \
                farewellRegister.objects.filter(dcIdno__icontains=stext)[0:5] | \
                farewellRegister.objects.filter(fullname__icontains=stext)[0:5]
        data=[]
        for i in range(len(result)):
            data.append({
                'bdid':result[i].BodyID,
                'fname':result[i].fullname,
                'dcid':result[i].dcIdno,
                'sex':result[i].dcGender,
                'age':result[i].dcAge,
                'obno':result[i].obNumber,
                'nokn':result[i].nokName,
                'nokp':result[i].nokPhone,
            })      
        return JsonResponse(data, safe=False)
    



@login_required
def searchbill(request): ### able to get username from the userid
    if request.method=='POST':
        stext=json.loads(request.body).get('searchText')
        result=PatientBill.objects.filter(BodyID=stext)
        data=[]
        for i in range(len(result)):
            data.append({
                'bdid':result[i].BodyID,
                'fname':result[i].fullname,
                'dcid':result[i].dcIdno,
                'sex':result[i].dcGender,
                'age':result[i].dcAge,
                'obno':result[i].obNumber,
                'nokn':result[i].nokName,
                'nokp':result[i].nokPhone,
            })      
        return JsonResponse(data, safe=False)