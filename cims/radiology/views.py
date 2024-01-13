from django.shortcuts import render

from MedicalRecords.models import *
from django.http import JsonResponse
import json
from .models import *
from django.contrib.auth.decorators import login_required
from systemusers.models import CustomUser
from django.db.models import Q

from datetime import date, timedelta,datetime

from reports.models import deptReport

# Create your views here.
@login_required
def rad_index(request):
    context={}   
    return render(request, 'dashboard/radiology/rad_index.html', context)

@login_required
def manualbill(request):
    patType = PatientType.objects.all()
    context={
        'patType':patType
    }
    return render(request, 'dashboard/radiology/manualbill.html', context)


@login_required
def rad_reception(request):
    patType = PatientType.objects.all()
    context={
        'patType':patType
    }
    return render(request, 'dashboard/radiology/rad_reception.html', context)



@login_required
def retrieve_request(request):
    if request.method == 'POST': 
        startdate = datetime.now()
        enddate = startdate - timedelta(hours=24)
        search_str = json.loads(request.body).get('ptype')
        vno=''
        pmode=''

        sql=PatientBill.objects.filter(Q(status='pending',bill_date__gte=enddate,bill_point='radiology',patient_type= search_str)|Q(status='billed',bill_date__gte=enddate,bill_point='radiology',patient_type= search_str)).distinct('op_number').order_by('op_number','-bill_date')
       
        data=[]        
        for i in range(len(sql)):
            if search_str=='In-Patient':                    
                vno=sql[i].visitNoIp.visitId
                pmode=sql[i].visitNoIp.subname.sub_name
            else:
                vno=sql[i].visitNo.visitNo
                pmode=sql[i].visitNo.subname.sub_name
            data.append({
                'date':sql[i].bill_date.strftime('%Y-%m-%d(%I:%M%p)'),
                'pno':sql[i].op_number.op_number,
                'pname':sql[i].op_number.fullname,                
                'age':sql[i].op_number.patient_age,                
                'gend':sql[i].op_number.gender,                
                'urgency':sql[i].urgency,
                'staff':sql[i].billed_by.username,
                'pymode':pmode,
                'vno':vno,
                'pstatus':sql[i].pay_status
            })    
        return JsonResponse(data, safe=False)


@login_required
def retrieveptreq(request):
    if request.method == 'POST': 
        startdate = datetime.now()
        enddate = startdate - timedelta(hours=24)
        search_str = json.loads(request.body).get('pid')
        sql=PatientBill.objects.filter(Q(status='pending',bill_date__gte=enddate,bill_point='radiology',op_number= search_str)|Q(status='billed',bill_date__gte=enddate,bill_point='radiology',op_number= search_str)).order_by('service__service_name')
        data=[]        
        for i in range(len(sql)):
            data.append({                 
                'reff_no':sql[i].ref_number,
                'test_no':sql[i].service.scode,
                'svs_name':sql[i].service.service_name,
                'qnt':sql[i].quantity,                
                'total':sql[i].total_price,
                'py_status':sql[i].pay_status
            })     
        return JsonResponse(data, safe=False)



@login_required
def cash_bill_service(request):
    if request.method=='POST':
        bill=json.loads(request.body) 
        msg=''

        for i in range(len(bill)):
            try:
                rbill=PatientBill.objects.get(ref_number=bill[i]["rfno"])                
                rbill.pay_status='billed'
                rbill.save()
                msg='bill raised & sent successfully'
            except ValueError as err:
                msg=str(err)

        data = {'res': msg}

        return JsonResponse(data, safe=False)

@login_required
def paid_service(request):
    if request.method=='POST':         
        rf_no=json.loads(request.body).get('reff_no')
        test_no=json.loads(request.body).get('test_id')        
        pid=json.loads(request.body).get('pid') 
        vno=json.loads(request.body).get('vno')
        
        datenow = datetime.now()
        imageid=datenow.strftime('%S%I%M%m%d%Y')
        userId=request.user.id 

        res_msg='' 

        rbill=PatientBill.objects.get(ref_number=rf_no)                
        rbill.status='received'
        rbill.save()     
        
        exam_info= ExamResult.objects.filter(request_reff_no=rf_no)        
        if not exam_info.exists():
            new_exam=ExamResult()
            new_exam.op_number=PatientBioData.objects.get(op_number = pid) 
            new_exam.request_reff_no=PatientBill.objects.get(ref_number =rf_no)
            new_exam.request_service=Services.objects.get(scode =test_no) 
            new_exam.exam_status='in-progress'
            new_exam.uuid_no=imageid
            new_exam.VisitNo=vno
            new_exam.received_by=CustomUser.objects.get(id=userId)
            new_exam.save()
            res_msg='Success!! Request queued for processing'
        
        else:
            res_msg='Image already registered' #uuid_no
            for i in range(len(exam_info)):
                imageid=exam_info[i].uuid_no

        data = {'res': res_msg,'sid':imageid}
        return JsonResponse(data, safe=False)



@login_required
def record_miss_reason(request):
    if request.method=='POST':         
        rf_no=json.loads(request.body).get('reff_no')
        rs=json.loads(request.body).get('rs')
        res_msg=''

        exam_info= ExamMiss.objects.filter(request_reff_no=rf_no)
        if not exam_info.exists():
            new_exam=ExamMiss()            
            new_exam.request_reff_no=PatientBill.objects.get(ref_number =rf_no)
            new_exam.reason=rs
            new_exam.save()
            
            res_msg='Reason captured successfully'
        # also update exam result ststus to missed exam
        data = {'res': res_msg}
        return JsonResponse(data, safe=False)
    



@login_required
def refresh_list(request):
    startdate = date.today()
    enddate = startdate - timedelta(hours=24)        
    sql=ExamResult.objects.filter(receive_date__range=[enddate,startdate],exam_status='in-progress').order_by('receive_date','receive_time')
    
    data=[]        
    for i in range(len(sql)):
        data.append({
            'ex_no':sql[i].exam_no,
            'pid':sql[i].op_number.op_number,
            'pname':sql[i].op_number.fullname,
            'age':sql[i].op_number.patient_age,
            'gend':sql[i].op_number.gender,
            'service':sql[i].request_service.service_name,
            'status':sql[i].exam_status,
            'rdate':sql[i].receive_date,
            'uuid':sql[i].uuid_no,
            'rtime':sql[i].receive_time.strftime('%H:%M')
        })
    
    return JsonResponse(data, safe=False)




@login_required
def complete_exam(request):
    today = date.today() 
    sql=ExamResult.objects.filter(exam_notes_date=today,exam_status='complete').order_by('-exam_notes_date','-exam_notes_time')        
    data=[]        
    for i in range(len(sql)):
        data.append({
            'ex_no':sql[i].exam_no,
            'pid':sql[i].op_number.op_number,
            'pname':sql[i].op_number.fullname,
            'age':sql[i].op_number.patient_age,
            'gend':sql[i].op_number.gender,
            'service':sql[i].request_service.service_name,
            'rdate':sql[i].exam_notes_date,
            'uuid':sql[i].uuid_no,
            'rtime':sql[i].exam_notes_time.strftime('%H:%M'),
            'rpby':sql[i].notes_by.username,
        })
    
    return JsonResponse(data, safe=False)
    

def complete_date_exam(request):
     if request.method=='POST':
        import datetime
        fdate =json.loads(request.body).get('fdate')
        tdate =json.loads(request.body).get('tdate') 

        frdate = datetime.datetime.strptime(fdate, '%Y-%m-%d')
        ttdate = datetime.datetime.strptime(tdate, '%Y-%m-%d')
        todate=ttdate + timedelta(hours=23,minutes=59,seconds=59) 

        sql=ExamResult.objects.filter(exam_notes_date__range=[frdate,todate],exam_status='complete').order_by('-exam_notes_date','-exam_notes_time')
        data=[]        
        for i in range(len(sql)):
            data.append({
                'ex_no':sql[i].exam_no,
                'pid':sql[i].op_number.op_number,
                'pname':sql[i].op_number.fullname,
                'age':sql[i].op_number.patient_age,
                'gend':sql[i].op_number.gender,
                'service':sql[i].request_service.service_name,
                'rdate':sql[i].exam_notes_date,
                'uuid':sql[i].uuid_no,
                'rtime':sql[i].exam_notes_time.strftime('%H:%M'),
                'rpby':sql[i].notes_by.username,
            })
        
        return JsonResponse(data, safe=False)

@login_required
def record_notes(request):
    if request.method=='POST':
        exid=json.loads(request.body).get('examid')
        tech=json.loads(request.body).get('radtech')
        imgid=json.loads(request.body).get('imgid')
        notes=json.loads(request.body).get('exnotes')

        msg=''
        nt_info=ExamResult.objects.get(exam_no=exid)
        if nt_info:
            dtoday=date.today()
            tnow=datetime.now().strftime("%I:%M:%S")
            nt_info.exam_notes =notes
            nt_info.exam_notes_date = dtoday  
            nt_info.exam_notes_time = tnow
            nt_info.exam_status = 'complete'
            nt_info.notes_by =CustomUser.objects.get(id=request.user.id)
            nt_info.radtech=tech
            nt_info.uuid_no=imgid
            nt_info.save()
            msg='examination notes saved successfully'
        else:
            msg='Error!!. saving failed'
       
        data = {'res': msg}
        return JsonResponse(data, safe=False)



@login_required
def radSearchService(request):
    if request.method == 'POST':        
        search_str = json.loads(request.body).get('searchText')       
        svs = list(Services.objects.filter(service_name__icontains=search_str,service_point='radiology')[0:5].values('scode','service_name'))
        
        return JsonResponse(svs, safe=False)
    
##############################################################  
@login_required
def refresh_list_pat(request):
    if request.method =='POST':
        startdate = date.today()
        enddate = startdate - timedelta(days=1) 
        pid=json.loads(request.body).get('searchText')       
        sql=ExamResult.objects.select_related('op_number','request_reff_no','request_service').filter(receive_date__range=[enddate,startdate],op_number=pid)
        
        data=[]        
        for i in range(len(sql)):
            data.append({
                'ex_no':sql[i].exam_no,
                'pid':sql[i].op_number.op_number,
                'pname':sql[i].op_number.fullname,
                'service':sql[i].request_service.service_name,
                'status':sql[i].exam_status,
                'rdate':sql[i].receive_date
            })
        
        return JsonResponse(data, safe=False)





@login_required
def search_exam_notes(request):
    if request.method == 'POST':       
        search_str = json.loads(request.body).get('searchText')
        response = list(ExamResult.objects.filter(exam_no=search_str).values('exam_notes','radtech'))                 
        return JsonResponse(response, safe=False)


@login_required
def consResultSearch(request):
   if request.method =='POST':
        startdate = date.today()
        enddate = startdate - timedelta(days=1) 
        pid=json.loads(request.body).get('searchText')              
        sql=ExamResult.objects.select_related('request_service').filter(receive_date__range=[enddate,startdate],op_number=pid)
        #print(str(sql.query))
        data=[]        
        for i in range(len(sql)):
            data.append({
                'ex_no':sql[i].exam_no,             
                'service':sql[i].request_service.service_name,
                'status':sql[i].exam_status,
                'rdate':sql[i].receive_date,
                'dept':'radiology'
            })
        return JsonResponse(data, safe=False)

@login_required
def consResultNotes(request):
    if request.method =='POST':        
        reffno=json.loads(request.body).get('reffNo')              
        sql=list(ExamResult.objects.filter(exam_no=reffno).values('notes_by','exam_notes','exam_notes_time','exam_notes_date'))       
        return JsonResponse(sql, safe=False)
    


################### settings ########################
@login_required
def servicelist(request):
    service = Services.objects.filter(service_point='radiology').order_by('service_name')
    context={
        'service':service
    }
    return render(request, 'dashboard/radiology/rad_service_list.html', context)

@login_required
def new_service(request):
    if request.method=='POST':
        sname=json.loads(request.body).get('sname')
        npr=json.loads(request.body).get('cprice')
        spr=json.loads(request.body).get('sprice')
        stt=json.loads(request.body).get('stt')
        nservice=Services()
        nservice.service_name=sname        
        nservice.normal_rate=npr
        nservice.scheme_rate=spr
        nservice.status=stt
        nservice.service_type='service'
        nservice.service_point='radiology'
        nservice.staff=CustomUser.objects.get(id=request.user.id)
        nservice.save()
        data={'res':'Added successfully'}

        return JsonResponse(data, safe=False)


@login_required
def update_service(request):
    if request.method=='POST':
        sid=json.loads(request.body).get('sid')
        sname=json.loads(request.body).get('sname')
        npr=json.loads(request.body).get('cprice')
        spr=json.loads(request.body).get('sprice')
        stt=json.loads(request.body).get('stt')

        nservice=Services.objects.get(scode=sid)
        nservice.service_name=sname        
        nservice.normal_rate=npr
        nservice.scheme_rate=spr
        nservice.status=stt
        nservice.staff=CustomUser.objects.get(id=request.user.id)
        nservice.save()
        data={'res':'Updated successfully'}
        return JsonResponse(data, safe=False)


@login_required
def trynotes(request):
    if request.method=='POST':
        notes=json.loads(request.body).get('notes')
        sql=examnotes()
        sql.radnotes=notes
        sql.save()
        data={'res':'tried successfully'}
        return JsonResponse(data, safe=False)




@login_required
def rtv_notes(request):
    if request.method=='POST':
        sql=examnotes.objects.filter(id=1)        
        data=[]
        for i in range(len(sql)):
            data.append({
                'notes':sql[i].radnotes
            })
        return JsonResponse(data, safe=False)
########################### reports ##################################
@login_required
def rad_report(request):
    repname=deptReport.objects.filter(departmentName__deptName='radiology').order_by('reportName')
    context={'radrep':repname}
    return render(request, 'dashboard/radiology/rad_report.html',context)
