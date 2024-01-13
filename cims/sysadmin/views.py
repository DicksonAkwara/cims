from django.shortcuts import render
from MedicalRecords.models import *
from consultation.models import patientReferral
from django.contrib.auth.decorators import login_required
from systemusers.models import CustomUser
from finance.models import PatientBill
from laboratory.models import LabResult
from radiology.models import ExamResult
from pharmacy.models import PharmDispense
from django.contrib.auth.decorators import login_required
from datetime import date, timedelta
from django.http import JsonResponse
from django.db.models import Sum,F
import json

@login_required
def sysindex(request):     
    context = {             
    }    
    #return render(request, 'dashboard/sysadmin/sysindex.html',context)
    return render(request, 'dashboard/main/dashboard.html',context)

@login_required
def index(request):
    #ustype=CustomUser.objects.all().values('user_type','department')
    #print(ustype)
    context = {             
    }    
    return render(request, 'dashboard/sysadmin/index.html',context)


@login_required
def adminstats(request):    
    context = { 
                 
    }
    return render(request, 'dashboard/main/adminstats.html',context)

@login_required
def admincharts(request):  
    today = datetime.now()
    one_week_past = today - timedelta(days=7)
    data=[]
    ## need to get every single date for th last 7days
    current_date = today

    while one_week_past <= current_date:
    # Access the date component of the current date
        vdate = one_week_past.date()
        ttvisit=OpVisits.objects.filter(visit_date=vdate).distinct('op_number').count()
        #get day name only
        day=vdate.strftime('%A')
        
        data.append({
        str(day):int(ttvisit) 
        })    
    # Increment the current date by one day
        one_week_past += timedelta(days=1)

    aweek_earlier=today - timedelta(days=7)
    data.append({
        'date_range':'One week Data From '+aweek_earlier.strftime('%d/%m/%Y')+' to '+today.strftime('%d/%m/%Y')
    })

    #geting scheme and cash counts
    cashcount=[]
    schemecount=[]
    tcash=[]
    tscheme=[]
    
    pcount=0
    fvdate= today - timedelta(days=7)
    vdate=fvdate.date()
    cash=OpVisits.objects.filter(visit_date__gte=vdate,visit_date__lte=today,paymode='Non-scheme').distinct('op_number').count()
    if cash:
        pcount=cash
    cashcount.append({'cash':pcount})

    scheme=OpVisits.objects.filter(visit_date__gte=vdate,visit_date__lte=today,paymode='Scheme').distinct('op_number').count()
    if scheme:
        pcount=scheme

    schemecount.append({'scheme':scheme})

    ##scheme=OpVisits.objects.filter(visit_date__gte=vdate,visit_date__lte=today).distinct('op_number').exclude(paymode__icontains='Non-scheme').count()
    sm=0
    ##today revenue both cash and scheme
    fdate = today.replace(hour=0,minute=0,second=0,microsecond=0)
    todate=fdate + timedelta(hours=23,minutes=59,seconds=59)
    cashtoday=PatientBill.objects.filter(paymode='cash',bill_date__range=[fdate,todate],pay_status='paid').aggregate(Sum('total_price'))['total_price__sum']
    if cashtoday:
        sm=cashtoday        
    tcash.append({'tcash':sm})

    schtoday=PatientBill.objects.filter(bill_date__range=[fdate,todate],pay_status='paid').exclude(paymode='cash').aggregate(Sum('total_price'))['total_price__sum']
    if schtoday:
        sm=schtoday
    tscheme.append({'tscheme':sm})

    ##compare revenue for various schemes the past 7 days
    sc_counts=[]
    schemes=OpVisits.objects.filter(visit_date__gte=vdate,visit_date__lte=today,paymode='Scheme').distinct('subname')
    stotal=0
    for i in range(len(schemes)):
        cnt=OpVisits.objects.filter(visit_date__gte=vdate,visit_date__lte=today,subname=schemes[i].subname).count()
        if cnt:
            stotal=cnt

        sc_counts.append({
            schemes[i].subname.sub_name:stotal
        })

    ## new and revisit patients

    vtype_count=[]    
    vpcount=0
    fvdate= today - timedelta(days=7)
    vdate=fvdate.date()
    vtype=OpVisits.objects.filter(visit_date__gte=vdate,visit_date__lte=today).distinct('visit_type')
    for i in range(len(vtype)):
        cnt=OpVisits.objects.filter(visit_date__gte=vdate,visit_date__lte=today,visit_type=vtype[i].visit_type).count()
        if cnt:
            vpcount=cnt
        vtype_count.append({vtype[i].visit_type:vpcount})

  ### lab,rad and presc requests
    
    labcount=LabResult.objects.filter(results_date__range=[fdate,todate],exam_status='verified').count()
    radcount=ExamResult.objects.filter(exam_notes_date__range=[fdate,todate],exam_status='complete').count()
    phacount=PharmDispense.objects.filter(DispenseDate__range=[fdate,todate],status='dispensed').count()
   

### admissions
    admcount=IpVisit.objects.filter(admissionDate__range=[fdate,todate],admStatus='active').count()
    occp=IpVisit.objects.filter(admStatus='active').count()
    reff=patientReferral.objects.filter(requestDate__range=[fdate,todate],referralType='external').count()
### today visits
    rvisit=OpVisits.objects.filter(visit_date__range=[fdate,todate],visit_type='revisit').count()
    nvisit=OpVisits.objects.filter(visit_date__range=[fdate,todate],visit_type='newPatient').count()

    context = { 
        'visits':data, 
        'cashcount':cashcount,                
        'schemecount':schemecount,                
        'tcash':tcash,                
        'tscheme':tscheme, 
        'sc_counts':sc_counts,             
        'vtype_count':vtype_count, 
        'lab':labcount,         
        'rad':radcount,         
        'phar':phacount, 
        'admcount': admcount,
        'occp':occp,
        'reff':reff,
        'rvisit':rvisit,
        'nvisit':nvisit,
    }
    return JsonResponse(context, safe=False)

    
    
