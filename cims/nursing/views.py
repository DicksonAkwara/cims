from django.shortcuts import render
from MedicalRecords.models import *
from nursing.models import *
from finance.models import *
from systemusers.models import *
from sysadmin.models import *
from stores.models import SubStoreItem,StoreAllocation
from consultation.models import Prescription
from pharmacy.models import PharmDispense
import json
from django.http import JsonResponse
from datetime import date,datetime, timedelta
# Create your views here.
from django.contrib.auth.decorators import login_required

@login_required
def nurse_index(request):
    context={ }
    return render(request,'dashboard/nurse/nurse_index.html', context)


@login_required
def nurse_cardex(request):
    wards=IpWard.objects.all().order_by('wardName').values('wardName')
    context={ 
        'wards':wards
    }
    return render(request,'dashboard/nurse/nurse_cardex.html', context)

@login_required
def nurse_triage(request):
    clinic = OpClinics.objects.all().values('clinic_name')      
    context = {       
        'clinics':clinic      
    }    
    return render(request,'dashboard/nurse/nurse_triage.html', context)

@login_required
def nurse_ip_triage(request):
    
    wards=IpWard.objects.all().order_by('wardName').values('wardName')  
    context = {       
        'wards':wards      
    }    
    return render(request,'dashboard/nurse/nurse_ip_triage.html', context)

@login_required
def stations(request):
    if request.method=='POST':
        pat_type=json.loads(request.body).get('pat_type')
        data=[]
        sql=''  
        if pat_type =='In-Patient':
            sql = IpWard.objects.all().values('wardName')
            for i in range(len(sql)):
                data.append({
                    'stname':sql[i]['wardName']
                })
        else:
            sql = OpClinics.objects.all().values('clinic_name')
            for i in range(len(sql)):
                data.append({
                    'stname':sql[i]['clinic_name']
                })

        return JsonResponse(data, safe=False) 

@login_required
def ipwards(request):
    opd = IpWard.objects.all().values()
    data=list(opd)
    return JsonResponse(data, safe=False) 

@login_required
def inpatient_list(request):
    if request.method=='POST':
        data=[]
        ward = json.loads(request.body).get('ward')
        sql = IpVisit.objects.filter(admStatus='active',wardName__wardName=ward).order_by('-admissionDate','-admissionTime') 
        if sql:
            for i in range(len(sql)):
                data.append({
                    'adate':sql[i].admissionDate,
                    'atime':sql[i].admissionTime.strftime('%I:%M %p'),
                    'ddate':sql[i].dischargeDate,
                    'dtime':sql[i].dischargeTime,#.strftime('%I:%M %p'),
                    'pno':sql[i].ipNumber.op_number,
                    'pname':sql[i].ipNumber.fullname,
                    'page':sql[i].ipNumber.patient_age,
                    'pgend':sql[i].ipNumber.gender,
                    'pward':sql[i].wardName.wardName,
                    'pmode':sql[i].subname.sub_name,
                    'urg':'Normal',
                    'vno':sql[i].visitId,
                    'dischby':'' #sql[i].dischargeBy.username
                })
  
        return JsonResponse(data, safe=False)
    
@login_required
def outpatient_list(request):
    if request.method=='POST':
        data=[]
        today = datetime.now()     
        enddate = today - timedelta(hours=24)
        clinic=json.loads(request.body).get('clinic') 
        
        sql=''
        if clinic=='All':
            sql=OpVisits.objects.filter(visit_date__gte=enddate).order_by('-visit_date','-visit_time')
        else:
            sql = OpVisits.objects.filter(visit_date__gte=enddate,clinic_name__clinic_name=clinic).order_by('-visit_date','-visit_time')
        
        if sql:
            for i in range(len(sql)):
                data.append({
                    'adate':sql[i].visit_date,
                    'atime':sql[i].visit_time.strftime('%I:%M %p'),
                    'pno':sql[i].op_number.op_number,
                    'pname':sql[i].op_number.fullname,
                    'page':sql[i].op_number.patient_age,
                    'pgend':sql[i].op_number.gender,
                    'pward':sql[i].clinic_name.clinic_name,
                    'pmode':sql[i].subname.sub_name,
                    'urg':sql[i].urgency,
                    'vno':sql[i].visitNo,
                })

        return JsonResponse(data, safe=False)





@login_required
def nurse_ops(request):
    patType = PatientType.objects.all()    
    station = StoreAllocation.objects.filter(staffName=request.user.id,storeName__category='Sub Store',storeName__purpose='nursing').order_by('storeName__store_name')   
    #storeName.category='Sub Store',purpose='nursing',
    context = {       
        'patType':patType,        
        'stations':station,        
    }    
    return render(request,'dashboard/nurse/nurse_ops.html', context) 

@login_required
def nurse_ip_ops(request):    
    wards = IpWard.objects.all()   
    context = {
        'wards':wards,        
    }    
    return render(request,'dashboard/nurse/nurse_ip_ops.html', context)


@login_required
def nurse_disch(request):   
    wards = IpWard.objects.all()   
    context = {       
        'wards':wards,        
    }    
    return render(request,'dashboard/nurse/nurse_discharge.html', context)
    

@login_required
def nurse_referral(request): 
    reffact=referalFacility.objects.all()  
    patType = PatientType.objects.all()   
    context = {       
        'patType':patType,        
        'reffact':reffact,        
    }    
    return render(request,'dashboard/nurse/nurse_referral.html', context)

@login_required
def nurse_report(request):
    context = {}    
    return render(request,'dashboard/nurse/nurse_report.html', context)

@login_required
def nurse_adm(request):   
    wards = IpWard.objects.all()   
    context = {       
        'wards':wards,        
    }    
    return render(request,'dashboard/nurse/nurse_adm.html', context)

@login_required
def theater_adm(request):   
    theatre = Theatre.objects.all()   
    context = {       
        'thr':theatre,        
    }    
    return render(request,'dashboard/nurse/nurse_adm_theater.html', context)

@login_required
def theatre_checklist(request):   
    theatre = Theatre.objects.all()   
    context = {       
        'thr':theatre,        
    }    
    return render(request,'dashboard/nurse/theatre_checklist.html', context)

@login_required
def theatre_bill(request):   
    theatre = Theatre.objects.all()   
    context = {       
        'thr':theatre,        
    }    
    return render(request,'dashboard/nurse/theatre_bill.html', context)

@login_required
def theatre_services(request):   
    proc = Services.objects.filter(service_point='theatre')   
    context = {       
          'proc':proc     
    }    
    return render(request,'dashboard/nurse/theatre_services.html', context)

@login_required
def theatre_discharge(request):   
    theatre =Theatre.objects.all()
    context = {       
        'theatre':theatre      
    }    
    return render(request,'dashboard/nurse/theatre_discharge.html', context)


@login_required
def check_cons_payment(request):
    if request.method=='POST':
        pid = json.loads(request.body).get('pid')
        today=datetime.today()
        bill_date=today-timedelta(days=3)
        sql=PatientBill.objects.filter(op_number=pid, bill_date__gte=bill_date,patient_type='Out-Patient',pay_status='paid',service__service_name__icontains='consultation')
        
        if sql:
            data={'msg':'paid'}
        else:
            data={'msg':'pending'}
        return JsonResponse(data,safe=False)


@login_required
def save_triage(request):
    if request.method =='POST':
        urg=request.POST.get('paturgency') 
        """ startdate = date.today()        
        enddate = startdate - timedelta(days=1) """  

        patno=request.POST.get('patid') 
        vno=request.POST.get('vno') 

        triage_info=Triage()        
        triage_info.op_number = PatientBioData.objects.get(op_number = patno)
        triage_info.temperature = request.POST.get('btemp')
        triage_info.urgency = urg
        triage_info.blood_pressure = request.POST.get('bpress')
        triage_info.pulse_rate = request.POST.get('pulse')
        triage_info.weight = request.POST.get('bweight')
        triage_info.muac = request.POST.get('muac')
        triage_info.blood_oxygen = request.POST.get('spo')
        triage_info.height = request.POST.get('bheight')
        triage_info.pat_status = request.POST.get('patstaus')
        triage_info.nurse_notes = request.POST.get('trg_notes')
        triage_info.visitno=OpVisits.objects.get(visitNo=request.POST.get('vno'))
        triage_info.staff = CustomUser.objects.get(id=request.user.id)
        
        
        pat=OpVisits.objects.get(visitNo=vno) #should update the last visit  
        #TableName.objects.filter(key=value).order_by('-date_filed').first()      
        pat.urgency=urg
        triage_info.save()
        pat.save()
        message = {'msg': f'Triage details '}
        data = {
                'user': message
            }
        
        return JsonResponse(data)

@login_required
def triagelist(request):
    if request.method=='POST':
        data=[]
        ddf = json.loads(request.body).get('dtf')        
        ddt = json.loads(request.body).get('dtt')        
        sql = Triage.objects.select_related('op_number').filter(triage_date__range=[ddf,ddt]).order_by('-triage_date','-triage_time')
        ttpat=Triage.objects.filter(triage_date__range=[ddf,ddt]).distinct('op_number').count()
        ttc=Triage.objects.filter(triage_date__range=[ddf,ddt]).count()
        if sql:
            for i in range(len(sql)):
                data.append({
                'tdate':sql[i].triage_date,
                'ttime':sql[i].triage_time.strftime('%I:%M%p'),
                'pno':sql[i].op_number.op_number,
                'pname':sql[i].op_number.fullname,
                'age':sql[i].op_number.patient_age,                                
                'tp':sql[i].temperature,                                
                'bp':sql[i].blood_pressure,                                
                'sp':sql[i].blood_oxygen,                                
                'mc':sql[i].muac,                                
                'pul':sql[i].pulse_rate,                                
                'ht':sql[i].height,              
                'wt':sql[i].weight,
                'ptcount':ttpat,
                'wkcount':ttc,
            }) 

        return JsonResponse(data, safe=False)
    
########### nurse operation methods ############################
@login_required
def doctorequest(request):
    if request.method=='POST':
        data=[]
        pid = json.loads(request.body).get('pid')        
        vno = json.loads(request.body).get('vno')
        startdate = datetime.now()     
        enddate = startdate - timedelta(hours=24)
        sql=PatientBill.objects.filter(bill_date__gte=enddate,op_number=pid,visitNo=vno,bill_point='nursing').exclude(status='done').order_by('bill_date')|\
            PatientBill.objects.filter(bill_date__gte=enddate,op_number=pid,visitNo=vno,bill_point='pharmacy').exclude(status='done').order_by('bill_date')
        if sql:
            for i in range(len(sql)):
                data.append({
                    'rfn':sql[i].ref_number,
                    'tdate':sql[i].bill_date,
                    'item':sql[i].service.service_name,
                    'inst':sql[i].service.service_name,
                    'qnt':sql[i].quantity,
                    'cost':sql[i].total_price,
                    'pstt':sql[i].pay_status,
                    'stt':sql[i].status,
                    'by':sql[i].billed_by.username,
                    'type':'svs',
                    'itcode':sql[i].service.scode,
                })
        pql=Prescription.objects.filter(prescDate__gte=enddate,opNumber=pid,status='pending')
        if pql:
            for i in range(len(pql)):
                data.append({
                    'rfn':pql[i].prescNo,
                    'tdate':pql[i].prescDate,
                    'item':pql[i].itemCode.itemName,
                    'inst':'Dos:'+str(pql[i].dosage)+',Freq:'+str(pql[i].frequency)+',Days:'+str(pql[i].days),
                    'qnt':pql[i].quantity,
                    'cost':pql[i].price,
                    'pstt':pql[i].status,
                    'stt':pql[i].status,
                    'by':pql[i].doctor.username,
                    'type':'drg',
                    'itcode':pql[i].itemCode.itemId,
                })

        return JsonResponse(data, safe=False)

@login_required  
def servicesearch(request):
    if request.method=='POST':
        search_str = json.loads(request.body).get('svsname')
        svs = Services.objects.filter(service_name__icontains=search_str,service_point='pharmacy')[0:5]|\
              Services.objects.filter(service_name__icontains=search_str,service_point='nursing')[0:5] 
        data = svs.values()
        return JsonResponse(list(data), safe=False)
    
@login_required
def administer(request):
    if request.method=='POST':
        data=[]
        bill = json.loads(request.body).get('bill')
        today=datetime.now()
        stype=''
        for i in range(len(bill)):
            stype=bill[i]['typ']
            ns_operation=bill[i]['nsop']
            pymode=bill[i]['pymode']
            refno=bill[i]['rfno']
            if refno=='0':
                ##if rfno is zero insert into patient bill
                cbill=PatientBill()
                cbill.op_number=PatientBioData.objects.get(op_number = bill[i]["op_no"])
                cbill.paymode=pymode
                cbill.patient_type='Out-Patient'
                cbill.bill_point='nursing'                    
                cbill.service=Services.objects.get(service_name=bill[i]["itname"]) 
                cbill.quantity=bill[i]["qnt"]
                cbill.total_price=bill[i]["total_price"]
                cbill.pay_status='paid'
                cbill.visitStatus='open'
                cbill.status='done'
                cbill.invoice_status='pending'
                cbill.visitNo=OpVisits.objects.get(visitNo=bill[i]["vno"]) 
                cbill.station=Store.objects.get(store_Id=bill[i]['sttn'])  
                cbill.billed_by=CustomUser.objects.get(id=request.user.id)
                cbill.done_by=CustomUser.objects.get(id=request.user.id)
                cbill.save()

            else:
                ##if stype=='svs' or stype=='service':
                ptbill=PatientBill.objects.get(ref_number=bill[i]['rfno'])
                ptbill.quantity=bill[i]['qnt']
                ptbill.total_price=bill[i]['total_price']
                ptbill.status='Done'
                ptbill.station=Store.objects.get(store_Id=bill[i]['sttn'])
                ptbill.done_by=CustomUser.objects.get(id=request.user.id)
                ptbill.save()

            if pymode=='cash':
                ql=cashierReceipt.objects.get(billReffNo__ref_number=bill[i]['rfno'])
                if ql:
                    ql.receipt_status='used'
                    ql.save()

            if stype=='drg' or stype=='item':
                ### insert into phardispense
                disp=PharmDispense()
                disp.patnumber=PatientBioData.objects.get(op_number=bill[i]['op_no'])
                disp.drug_item=DrugGeneralItem.objects.get(itemName=bill[i]['itname'])
                disp.store=Store.objects.get(store_Id=bill[i]['sttn'])
                disp.quant=bill[i]['qnt']
                disp.total_price=bill[i]['total_price']
                disp.receipt_no=bill[i]['rcpt']
                disp.invoice_no=bill[i]['rcpt']
                disp.status='dispensed'
                disp.DispenseDate=today
                disp.pharmacist=CustomUser.objects.get(id=request.user.id)
                disp.save()


                ### subtract in balances
                subtr=SubStoreItem.objects.get(storeId=bill[i]['sttn'],itemCode__itemName=bill[i]['itname'])
                subtr.itemBalance-=float(bill[i]['qnt'])
                subtr.save()

                if ns_operation=='requests':
                    ##update prescription
                    ptbill=Prescription.objects.get(prescNo=bill[i]['rfno'])
                    ptbill.quantity=bill[i]['qnt']
                    ptbill.price=bill[i]['total_price']
                    ptbill.status='dispensed'
                    ptbill.save()


        data.append({'msg':'administered successfully'})

        return JsonResponse(data, safe=False)
    
@login_required
def opraisebill(request):
    if request.method=='POST':
        data=[]
        bill = json.loads(request.body).get('bill')
        #today=datetime.now()
        stype=''
        for i in range(len(bill)):
            stype=bill[i]['typ']
            refno=bill[i]['rfno']

            if refno=='0':
                ##if rfno is zero insert into patient bill
                cbill=PatientBill()
                cbill.op_number=PatientBioData.objects.get(op_number = bill[i]["op_no"])
                cbill.paymode=bill[i]["pym"]
                cbill.patient_type=bill[i]["pty"]
                cbill.bill_point='nursing'                    
                cbill.service=Services.objects.get(scode=bill[i]["itcode"]) 
                cbill.quantity=bill[i]["qnt"]
                cbill.total_price=bill[i]["total_price"]
                cbill.pay_status='billed'
                cbill.visitStatus='open'
                cbill.status='billed'
                cbill.visitNo=OpVisits.objects.get(visitNo=bill[i]["vno"])   
                cbill.billed_by=CustomUser.objects.get(id=request.user.id)
                cbill.save()

            else:
                if stype=='svs':
                    ptbill=PatientBill.objects.get(ref_number=bill[i]['rfno'])
                    ptbill.quantity=bill[i]["qnt"]
                    ptbill.total_price=bill[i]["total_price"]
                    ptbill.pay_status='billed'
                    ptbill.status='billed'
                    ptbill.save()

                elif stype=='drg':
                    #insert into patient bill and update status to billed
                    cbill=PatientBill()
                    cbill.op_number=PatientBioData.objects.get(op_number = bill[i]["op_no"])
                    cbill.paymode=bill[i]["pym"]
                    cbill.patient_type=bill[i]["pty"]
                    cbill.bill_point='pharmacy'
                    cbill.service=Services.objects.get(scode=bill[i]["itcode"]) 
                    cbill.quantity=bill[i]["qnt"]
                    cbill.total_price=bill[i]["total_price"]
                    cbill.pay_status='billed'
                    cbill.visitStatus='open'
                    cbill.status='billed'
                    cbill.visitNo=OpVisits.objects.get(visitNo=bill[i]["vno"])   
                    cbill.billed_by=CustomUser.objects.get(id=request.user.id)
                    cbill.save()
                    #rff=cbill.pk

                    ##update prescription
                    presc=Prescription.objects.get(prescNo=bill[i]['rfno'])
                    presc.quantity=bill[i]['qnt']
                    presc.price=bill[i]['total_price']
                    presc.status='received'
                    presc.save()


        data.append({'msg':'Bill raised successfully'})
        return JsonResponse(data, safe=False)
    

def search_receipt(request):
    if request.method=='POST':
        data=[]
        rcpt = json.loads(request.body).get('rno')        
        pno = json.loads(request.body).get('pno')
        """ sql = PharmDispense.objects.select_related('drug_item','store').filter(receipt_no=rcpt,patnumber=pno,status='pending')
        if sql:
            for i in range(len(sql)):
                data.append({
                'rptno':sql[i].receipt_no,
                'dsid':sql[i].disp_id,
                'itemc':sql[i].drug_item.itemId,
                'itemname':sql[i].drug_item.itemName,
                'dos':sql[i].dosage,                                
                'freq':sql[i].frequency,                                
                'dys':sql[i].days,                                
                'qty':sql[i].quant,                                
                'ttp':sql[i].total_price,              
                'stre':sql[i].store.store_Id,
            })         """
        ## search in cashier reciept

        sql=cashierReceipt.objects.filter(receipt_no=rcpt,pat_card=pno,receipt_status='pending')
        if sql:
            for i in range(len(sql)):
                data.append({
                    'rfno':sql[i].billReffNo.ref_number,
                    'tdate':sql[i].trans_date.strftime('%d-%m-%Y(%I:%M%p)'),
                    'itemname':sql[i].billReffNo.service.service_name,
                    'inst':"",
                    'qnt':sql[i].billReffNo.quantity,
                    'cost':sql[i].paid_amount,
                    'pstt':sql[i].billReffNo.pay_status,
                    #'stt':sql[i].billReffNo.status,
                    'stt':sql[i].receipt_status,
                    'by':sql[i].billReffNo.billed_by.username,
                    'type':sql[i].billReffNo.service.service_type, 
                    'itcode':"", 
                    'cost':sql[i].paid_amount, 
                })
        return JsonResponse(data, safe=False)
    

def save_cardex(request):
    if request.method=='POST':
        data=[]
        pid = json.loads(request.body).get('pid')        
        vno = json.loads(request.body).get('vno')
        notes = json.loads(request.body).get('notes')        
        cdate = json.loads(request.body).get('cdate')
        ctime = json.loads(request.body).get('ctime')
        recdate = datetime.strptime(cdate, '%Y-%m-%d')

        sql=Cardex()
        sql.cardexDate=recdate
        sql.cardexTime=ctime
        sql.notes=notes
        sql.visitNo=IpVisit.objects.get(visitId=vno)
        sql.patNo=PatientBioData.objects.get(op_number=pid)
        sql.nurse=CustomUser.objects.get(id=request.user.id)
        sql.save()
        data.append({'msg':'Cardex notes saved successfuly'})
        
        return JsonResponse(data,safe=False)
    
def cardex_notes(request):
    if request.method=='POST':
        data=[]
        pid = json.loads(request.body).get('pid')        
        vno = json.loads(request.body).get('vno')
        today=datetime.today()
        less12hrs=today-timedelta(hours=12)

        sql=Cardex.objects.filter(patNo=pid,visitNo=vno,recordDate__gte=less12hrs).order_by('-cardexDate','-cardexTime')
        
        if sql:
            for i in range(len(sql)):
                data.append({
                    'refno':sql[i].reffNo,
                    'cdate':sql[i].cardexDate,
                    'ctime':sql[i].cardexTime,
                    'notes':sql[i].notes,
                    'nurse':sql[i].nurse.username,
                    'rdate':sql[i].recordDate.strftime('%Y-%m-%d(%I:%M%p)'),
                    'vno':sql[i].visitNo.visitId,
                })

        return JsonResponse(data, safe=False)
    




@login_required
def discharge_list(request):
    if request.method=='POST':
        data=[]
        ward = json.loads(request.body).get('ward')
        today = datetime.now()     
        enddate = today - timedelta(hours=24)
        sql = IpVisit.objects.filter(admStatus='active',wardName__wardName=ward,dischargeDate__gte=enddate).order_by('-dischargeDate','-dischargeTime') 
        if sql:
            for i in range(len(sql)):
                data.append({
                    'adate':sql[i].admissionDate,
                    'atime':sql[i].admissionTime.strftime('%I:%M %p'),
                    'ddate':sql[i].dischargeDate,
                    'dtime':sql[i].dischargeTime,#.strftime('%I:%M %p'),
                    'pno':sql[i].ipNumber.op_number,
                    'pname':sql[i].ipNumber.fullname,
                    'page':sql[i].ipNumber.patient_age,
                    'pgend':sql[i].ipNumber.gender,
                    'pward':sql[i].wardName.wardName,
                    'pmode':sql[i].subname.sub_name,
                    'urg':'Normal',
                    'vno':sql[i].visitId,
                    'dischby':'' #sql[i].dischargeBy.username
                })
  
        return JsonResponse(data, safe=False)
## filtered_result = Transaction.objects.filter(your_filter_conditions).aggregate(total_balance=Sum(F('debit') - F('credit')))['total_balance']

'''
# If you want to filter the queryset before calculating the sum, you can do something like this:
filtered_result = Order.objects.filter(your_filter_conditions).aggregate(
    total_difference=Sum(
        Case(
            When(status='paid', then=F('price')),
            When(status='pending', then=-F('price')),
            default=0,
            output_field=DecimalField()
        )
    )
)['total_difference']
'''