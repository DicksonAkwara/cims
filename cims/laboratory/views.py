from unittest import TestResult, result
from django.shortcuts import render
from datetime import date,datetime, timedelta
from MedicalRecords.models import *
from django.http import JsonResponse
import json
from django.utils import timezone
from django.db.models import Q

from systemusers.models import CustomUser
from .models import *
from .forms import *
from django.core import serializers
from finance.models import *
from django.db.models import Count, Sum
from django.contrib.auth.decorators import login_required
from reports.models import deptReport


#strftime("%Y-%m-%d(%I:%M%p)") 

# Create your views here.
@login_required
def lab_index(request):
    context={}
    return render(request,'dashboard/laboratory/lab_index.html',context)

@login_required
def testparamt(request): 
    tests=Services.objects.filter(service_point='laboratory').order_by('service_name') 
    form=LabtestForm() 
    context={
           'lbtest':tests,
           'form':form
    }   
    return render(request, 'dashboard/laboratory/test_parameters.html', context)

@login_required
def labusers(request):
    context={}
    return render(request,'dashboard/laboratory/allusers.html',context)

@login_required
def labdept(request):
    tests=Services.objects.filter(service_point='laboratory').order_by('service_name') 
    bench=labDepartment.objects.all()
    benchtest=LabDepartmentTest.objects.all().order_by('departmentname__departmentname','testname__service_name')
    benchform=LabBenchForm()
    context={
           'lbtest':tests,
           'benchform':benchform,
           'bench':bench,
           'benchtest':benchtest
    }
    return render(request,'dashboard/laboratory/lab_dept.html',context)

@login_required
def labreports(request):
    reports=deptReport.objects.filter(departmentName__deptName='laboratory').order_by('reportName')    
    context={
        'reports':reports
    }
    return render(request,'dashboard/laboratory/lab_report.html',context)





@login_required
def lab_reception(request):
    labdept=labDepartment.objects.all().order_by('departmentname')
    patType = PatientType.objects.all()
    context={
        'labbench':labdept,
        'patType':patType
        }
    return render(request,'dashboard/laboratory/lab_reception.html',context)


@login_required
def retrieve_request(request):
    if request.method == 'POST': 
        startdate = datetime.now()
        enddate = startdate - timedelta(hours=24)
        search_str = json.loads(request.body).get('ptype')
        vno=''
        pmode=''

        sql=PatientBill.objects.filter(Q(status='pending',bill_date__gte=enddate,bill_point='laboratory',patient_type= search_str)|Q(status='billed',bill_date__gte=enddate,bill_point='laboratory',patient_type= search_str)).distinct('op_number').order_by('op_number','-bill_date')
       
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
        sql=PatientBill.objects.filter(Q(status='pending',bill_date__gte=enddate,bill_point='laboratory',op_number= search_str)|Q(status='billed',bill_date__gte=enddate,bill_point='laboratory',op_number= search_str)).order_by('service__service_name')
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

        #print(data)     
        return JsonResponse(data, safe=False)



@login_required
def labfilterdaterequest(request):
    if request.method == 'POST': 
        fdate=datetime.strptime(json.loads(request.body).get('fdate'), '%Y-%m-%d').date() #converting str to date
        tdate=datetime.strptime(json.loads(request.body).get('tdate'), '%Y-%m-%d').date()
        search_str=json.loads(request.body).get('ptype')

        ffd=datetime.combine(fdate, datetime.min.time()) ##converting date to datetime
        ttd=datetime.combine(tdate, datetime.min.time())

        enddate=ttd + timedelta(hours=23,minutes=59,seconds=59)
        sql=PatientBill.objects.filter(Q(bill_date__range=[ffd,enddate],bill_point='laboratory',status='pending',patient_type= search_str)|Q(bill_date__range=[ffd,enddate],bill_point='laboratory',status='billed',patient_type= search_str))
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
def paidBillService(request):
    if request.method=='POST':         
        rf_no=json.loads(request.body).get('reff_no')
        test_no=json.loads(request.body).get('test_id')        
        pid=json.loads(request.body).get('pid') 
        vno=json.loads(request.body).get('vno') 

        datenow = datetime.now()
        year = datetime.now().year
        sampid=rf_no+'/'+str(year)

        cdate = datenow.date() 
        userId=request.user.id 

        res_msg='' 

        rbill=PatientBill.objects.get(ref_number=rf_no)                
        rbill.status='received'
        rbill.save()     
        
        exam_info= LabResult.objects.filter(request_reff_no=rf_no)        
        if not exam_info.exists():
            new_exam=LabResult()
            new_exam.op_number=PatientBioData.objects.get(op_number = pid) 
            new_exam.request_reff_no=PatientBill.objects.get(ref_number =rf_no)
            new_exam.request_service=Services.objects.get(scode =test_no) 
            new_exam.exam_status='in-progress'
            new_exam.sampleNo=sampid
            new_exam.VisitNo=vno
            new_exam.received_by=CustomUser.objects.get(id=userId)
            new_exam.save()
            res_msg='Success!! Request queued for processing'
        
        else:
            res_msg='Sample already registered'

        data = {'res': res_msg,'sid':sampid}
        return JsonResponse(data, safe=False)

@login_required
def labRefreshList(request):
    if request.method =='POST':
        startdate = date.today()
        enddate = startdate - timedelta(days=1)        
        sql=LabResult.objects.filter(receive_date__range=[enddate,startdate],exam_status='in-progress').distinct('op_number')|\
            LabResult.objects.filter(receive_date__range=[enddate,startdate],exam_status='complete').distinct('op_number')
        #print(str(sql.query))
        
        data=[] 
        if sql:       
            for i in range(len(sql)):
              
                data.append({
                    'ex_no':sql[i].result_no,
                    'pid':sql[i].op_number.op_number,
                    'pname':sql[i].op_number.fullname,
                    'service':sql[i].request_service.service_name,
                    'status':sql[i].exam_status,
                    'rdate':sql[i].receive_date
                })
        
        return JsonResponse(data, safe=False)


@login_required
def labRefreshResList(request):
    if request.method =='POST':
        fdate = json.loads(request.body).get('fdate')
        tdate = json.loads(request.body).get('tdate')      
        sql=LabResult.objects.select_related('op_number','request_reff_no','request_service').filter(receive_date__range=[fdate,tdate],exam_status='in-progress').distinct('op_number')
        #print(str(sql.query))
        
        data=[] 
        if sql:       
            for i in range(len(sql)):
              
                data.append({
                    'ex_no':sql[i].result_no,
                    'pid':sql[i].op_number.op_number,
                    'pname':sql[i].op_number.fullname,
                    'service':sql[i].request_service.service_name,
                    'status':sql[i].exam_status,
                    'rdate':sql[i].receive_date
                })
        
        return JsonResponse(data, safe=False)


@login_required
def labUnverifiedList(request):
    if request.method =='POST':
        startdate = date.today()
        enddate = startdate - timedelta(days=10)        
        sql=LabResult.objects.select_related('op_number','request_reff_no','request_service').filter(receive_date__range=[enddate,startdate],exam_status='complete').order_by('op_number')
        #print(str(sql.query))
        
        data=[] 
        if sql:       
            for i in range(len(sql)):
              
                data.append({
                    'ex_no':sql[i].result_no,
                    'pid':sql[i].op_number.op_number,
                    'pname':sql[i].op_number.fullname,
                    'service':sql[i].request_service.service_name,
                    'status':sql[i].exam_status,
                    'rdate':sql[i].receive_date,                   
                    'doneby':sql[i].performed_by.username,                   
                })
        #print(data)
        return JsonResponse(data, safe=False)

@login_required
def loadEditResult(request):
    if request.method =='POST':
        startdate = date.today()
        enddate = startdate - timedelta(days=1)        
        sql=LabResult.objects.select_related('op_number','request_reff_no','request_service').filter(receive_date__range=[enddate,startdate],exam_status='incomplete').order_by('op_number')
        #print(str(sql.query))
        
        data=[] 
        if sql:       
            for i in range(len(sql)):
              
                data.append({
                    'ex_no':sql[i].result_no,
                    'pid':sql[i].op_number.op_number,
                    'pname':sql[i].op_number.fullname,
                    'service':sql[i].request_service.service_name,
                    'status':sql[i].exam_status,
                    'rdate':sql[i].receive_date,                   
                    'reason':sql[i].editReason,                   
                })
        #print(data)
        return JsonResponse(data, safe=False)


@login_required
def labEnterResult(request):
    if request.method =='POST':
        startdate = date.today()
        enddate = startdate - timedelta(days=10) 
        pid=json.loads(request.body).get('searchText')       
        sql=LabResult.objects.select_related('op_number','request_reff_no','request_service').filter(receive_date__range=[enddate,startdate],op_number=pid)
               
        data=[] 
        if sql:       
            for i in range(len(sql)):              
                data.append({
                    'ex_no':sql[i].result_no,                 
                    'service_name':sql[i].request_service.service_name,                   
                    'service_code':sql[i].request_service.scode,                   
                    #'paramt':sql[i].parameter_reff_no, 
                })
        
        return JsonResponse(data, safe=False)


@login_required
def lab_result_list(request):
    if request.method =='POST':
        startdate = date.today()
        enddate = startdate - timedelta(days=1) 
        pid=json.loads(request.body).get('searchText')       
        sql=LabResult.objects.select_related('op_number','request_reff_no','request_service').filter(receive_date__range=[enddate,startdate],op_number=pid,exam_status='complete')
        #print(str(sql.query))
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
        #print(data)
        return JsonResponse(data, safe=False)

@login_required
def labTestMiss(request):
    if request.method == 'POST':       
        rf_no=json.loads(request.body).get('reff_no')
        rs=json.loads(request.body).get('rs')
        res_msg=''       
        exam_info= LabMissTest.objects.filter(request_reff_no=rf_no)
        if not exam_info.exists():
            new_exam=LabMissTest()            
            new_exam.request_reff_no=PatientBill.objects.get(ref_number =rf_no)
            new_exam.reason=rs
            new_exam.save()
            
            res_msg='Reason captured successfully'
        # also update exam result ststus to missed exam
        else:
            res_msg='Reason already captured '

        data = {'res': res_msg}
        return JsonResponse(data, safe=False)


@login_required
def loadTestParams(request):
    if request.method =='POST':       
        tsCode=json.loads(request.body).get('searchText')       
        sampId=json.loads(request.body).get('sampId')       
        data=[]
        #check if result already entered else load
        chkRes=LabResult.objects.filter(result_no=sampId,result_value__iexact='{}')
        if chkRes:
            sql=LabTestParameter.objects.filter(test_id=tsCode)
                    
            for i in range(len(sql)):
                data.append({
                    'prId':sql[i].param_no,
                    'prName':sql[i].param_name,
                    'prUnits':sql[i].value_units,
                    'lLimit':sql[i].lower_limit,
                    'uLimit':sql[i].upper_limit,
                    'posResult':sql[i].posible_result,
                    'prType':sql[i].param_type, #options or values
                    })
        else:
            result=list(LabResult.objects.filter(result_no=sampId).values('result_value'))
            data.append({'msg':'Result already entered','result':result})
            #data.append({'msg':'Result already entered.'})
        #print(data)
        return JsonResponse(data, safe=False)

@login_required
def labSaveResults(request):
    if request.method=='POST':
        rst=json.loads(request.body)
        datenow = datetime.now()
        cdate = datenow.date()
        ctime=datenow.time()
        #timenow=datetm.strftime('%H:%M:%S')        
        msg=''                
        txtResult=[] #creating a new json file without the test id
        billLength=len(rst)
        if billLength >0 :
          testId=rst[0]['testId']          
          comment=rst[1]['comment']

          for item in rst[2:]: 
            txtResult.append(item)
        
        testInfo= LabResult.objects.get(result_no=testId)
        if testInfo: 
                              
            testInfo.result_value=txtResult
            testInfo.exam_status='complete'
            testInfo.testComment=comment
            testInfo.results_date=cdate
            testInfo.results_time=ctime #.strftime('%I:%M,%p')
            testInfo.performed_by=CustomUser.objects.get(id=request.user.id)

            testInfo.save()
            msg='Result saved successfully'
           
        else:
            msg='error! failed to save'
        data = {'res': msg}
        return JsonResponse(data,safe=False)  


@login_required
def SearchUnverifiedResult(request): ### able to get username from the userid
    if request.method=='POST':
        tsCode=json.loads(request.body).get('searchText')
        #result=list(LabResult.objects.select_related('performed_by','performed_by').filter(result_no=tsCode).values('result_value','results_date','results_time','performed_by','confirmed_by','receive_date','receive_time','testComment'))
        result=LabResult.objects.select_related('performed_by','confirmed_by').get(result_no=tsCode)        
        data=[]         
        if result:
                data.append({
                    'result_value':result.result_value,
                    'results_date':result.results_date,
                    'results_time':result.results_time.strftime('%I:%M,%p'),
                    'performed_by':result.performed_by.username,                   
                    'receive_date':result.receive_date,
                    'receive_time':result.receive_time.strftime('%I:%M,%p'),
                    'testComment':result.testComment,
                })        
        return JsonResponse(data, safe=False) 

@login_required
def labSearchResult(request): ### able to get username from the userid
    if request.method=='POST':
        tsCode=json.loads(request.body).get('searchText')
        #result=list(LabResult.objects.select_related('performed_by','performed_by').filter(result_no=tsCode).values('result_value','results_date','results_time','performed_by','confirmed_by','receive_date','receive_time','testComment'))
        result=LabResult.objects.select_related('performed_by','confirmed_by').get(result_no=tsCode)        
        data=[]         
        if result:
                data.append({
                    'result_value':result.result_value,
                    'results_date':result.results_date,
                    'results_time':result.results_time.strftime('%I:%M,%p'),
                    'performed_by':result.performed_by.username,                    
                    'confirmed_by':result.confirmed_by.username,
                    'receive_date':result.receive_date,
                    'receive_time':result.receive_time.strftime('%I:%M,%p'),
                    'testComment':result.testComment,
                })        
        return JsonResponse(data, safe=False)         


@login_required
def labVerifyResults(request):
    if request.method == 'POST':       
        rsNo=json.loads(request.body).get('testid')
        datenow = datetime.now()
        cdate = datenow.date()
        ctime=datenow.time()
        
        testInfo= LabResult.objects.get(result_no=rsNo)
        if testInfo: 
            testInfo.exam_status='verified'            
            testInfo.results_date=cdate
            testInfo.results_time=ctime
            testInfo.confirmed_by=CustomUser.objects.get(id=request.user.id)

            testInfo.save()
            msg='Result verified successfully'           
        else:
            msg='error! failed to Verify.Try again'
        data = {'res': msg}
        return JsonResponse(data,safe=False) 


@login_required
def labAuthorizeEdit(request):
    if request.method == 'POST':       
        rsNo=json.loads(request.body).get('testid')       
        testInfo= LabResult.objects.get(result_no=rsNo)
        if testInfo: 
            testInfo.exam_status='in-progress' #eresult value should be updated to {}
            testInfo.result_value={}
            testInfo.save()
            msg='Request authorized successfully'           
        else:
            msg='error! failed to Verify.Try again'
        data = {'res': msg}
        return JsonResponse(data,safe=False) 


@login_required
def labrequestEdit(request):
     if request.method == 'POST':       
        rsNo=json.loads(request.body).get('testid')      
        reason=json.loads(request.body).get('reason')      
        testInfo= LabResult.objects.get(result_no=rsNo)
        if testInfo: 
            testInfo.editReason=reason
            testInfo.exam_status='incomplete'
            testInfo.requestedit_by=CustomUser.objects.get(id=request.user.id)
            testInfo.save()
            msg='Request sent successfully'           
        else:
            msg='error! failed to send request.Try again'
        data = {'res': msg}
        return JsonResponse(data,safe=False)


@login_required
def loadVerifiedResult(request):
    if request.method =='POST':
        startdate = date.today()
        enddate = startdate - timedelta(days=1)        
        sql=LabResult.objects.select_related('op_number','request_reff_no','request_service').filter(results_date__range=[enddate,startdate],exam_status='verified').order_by('op_number')
        #print(str(sql.query))
        
        data=[] 
        if sql:       
            for i in range(len(sql)):
              
                data.append({
                    'ex_no':sql[i].result_no,
                    'pid':sql[i].op_number.op_number,
                    'pname':sql[i].op_number.fullname,
                    'service':sql[i].request_service.service_name,                    
                    'rdate':sql[i].receive_date                                     
                })
        #print(data)
        return JsonResponse(data, safe=False)



@login_required
def loadVerFilterRes(request):
    if request.method =='POST':
        fdate = json.loads(request.body).get('fdate')
        tdate = json.loads(request.body).get('tdate')        
        sql=LabResult.objects.select_related('op_number','request_reff_no','request_service').filter(results_date__range=[fdate,tdate],exam_status='verified').order_by('op_number')
        #print(str(sql.query))
        
        data=[] 
        if sql:       
            for i in range(len(sql)):
              
                data.append({
                    'ex_no':sql[i].result_no,
                    'pid':sql[i].op_number.op_number,
                    'pname':sql[i].op_number.fullname,
                    'service':sql[i].request_service.service_name,                    
                    'rdate':sql[i].receive_date                                     
                })
        #print(data)
        return JsonResponse(data, safe=False)



@login_required
def consLabResSearch(request):
    if request.method =='POST':
        startdate = date.today()
        enddate = startdate - timedelta(days=2) 
        pid = json.loads(request.body).get('searchText')        
        sql=LabResult.objects.select_related('op_number','request_service').filter(results_date__range=[enddate,startdate],op_number=pid).order_by('result_no')
        #print(str(sql.query))
        
        data=[] 
        if sql:       
            for i in range(len(sql)):              
                data.append({
                    'sampID':sql[i].result_no,                    
                    'service':sql[i].request_service.service_name,                    
                    'status':sql[i].exam_status,                                     
                    'rdate':sql[i].results_date                                     
                })
        #print(data)
        return JsonResponse(data, safe=False)



@login_required
def labSearchService(request):
    if request.method == 'POST':        
        search_str = json.loads(request.body).get('searchText')       
        svs = list(Services.objects.filter(service_name__icontains=search_str,service_point='laboratory')[0:5].values('scode','service_name'))
        
        return JsonResponse(svs, safe=False)
    

@login_required
def labServiceDetails(request):
    if request.method == 'POST': 
        data=[]       
        id = json.loads(request.body).get('sid')       
        #pmode = json.loads(request.body).get('id')       
        svs =Services.objects.filter(scode=id)
        for i in range(len(svs)):
            data.append({
                'id':svs[i].scode,
                'sname':svs[i].service_name,
                'price':svs[i].normal_rate,
                'dpt':svs[i].service_point,
            })
        return JsonResponse(data, safe=False)


@login_required
def saveDirectBill(request):
    if request.method =='POST':        
        bill=json.loads(request.body)
        pb=bill["bill"] #it is the only main item in the dictionary 
                
        billLength=len(pb) 
        if billLength >0 :      
            for i in range(billLength):
                billInfo = PatientBill()
                billInfo.op_number=PatientBioData.objects.get(op_number = pb[i]["op_no"])                
                billInfo.paymode=pb[i]["pym"]
                billInfo.bill_point=pb[i]["dpt"]
                billInfo.service=Services.objects.get(scode = pb[i]["code"])                
                billInfo.quantity=1
                billInfo.total_price=pb[i]["cost"]
                billInfo.pay_status=pb[i]["pyst"]
                #billInfo.receipt_no=0
                billInfo.invoice_number=0
                #billInfo.billType=pb[i]["btype"]

                billInfo.save()
            res = {
                'msg': 'request(s) saved successfully'
            }
            return JsonResponse(res)


@login_required
def labPatientCard(request):
     if request.method == 'POST':        
        startdate = date.today()
        enddate = startdate - timedelta(days=1)
        search_str = json.loads(request.body).get('searchText')
        sql=PatientBill.objects.select_related('service').filter(op_number=search_str,bill_date__range=[enddate,startdate],bill_point='laboratory')
        data=[]        
        for i in range(len(sql)):
            data.append({
                'reff_no':sql[i].ref_number,
                'test_no':sql[i].service.scode,
                'svs_name':sql[i].service.service_name,
                'urgency':sql[i].urgency,
                'staff':sql[i].billed_by,
                'price':sql[i].total_price,
                'py_status':sql[i].pay_status
            }) 
        return JsonResponse(data, safe=False) 


@login_required
def labstoreitems(request):
    if request.method == 'POST':        
        result = SubStoreItem.objects.select_related('itemCode').filter(storeId__store_name__icontains='lab')      
        data=[]         
        if result:
                for i in range(len(result)):
                    data.append({
                        'itcode':result[i].itemCode.itemId,
                        'itname':result[i].itemCode.itemName,           
                    })        
        return JsonResponse(data, safe=False)   


@login_required
def labselecteditem(request):
    if request.method == 'POST':     
        search_str = json.loads(request.body).get('itcode')   
        result = SubStoreItem.objects.select_related('itemCode').get(itemCode=search_str)      
        data=[]         
        if result:
                data.append({
                    'itcode':result.itemCode.itemId,
                    'itname':result.itemCode.itemName,           
                    'pkg':result.itemCode.package,
                    'itbal':result.itemBalance
                    })        
        return JsonResponse(data, safe=False)         
       


@login_required
def labitemorder(request):
    if request.method =='POST':        
        bill=json.loads(request.body)
        pb=bill["bill"] #it is the only main item in the dictionary 
        today = date.today() 
        userId=request.user.id

        billLength=len(pb) 
        if billLength >0 :      
            for i in range(billLength):
                billInfo = labItemRequest()
                billInfo.requestDate=today
                billInfo.itemCode=DrugGeneralItem.objects.get(itemId = pb[i]["itcode"])                
                billInfo.requestQuant=pb[i]["qnt"]
                billInfo.bench=labDepartment.objects.get(departmentid=pb[i]["bench"])
                billInfo.requestBy=CustomUser.objects.get(id=userId)
                billInfo.save()
            res = {
                'msg': 'request(s) saved successfully'
            }
            return JsonResponse(res)





@login_required
def labrepbrief(request):
    if request.method=="POST": 
        
        cmonth=datetime.now().month #in digits  
        cyear=datetime.now().year #in digits  
        ttpat = PatientBioData.objects.filter(register_date__month__gte=cmonth,register_date__year__gte=cyear).count()
        comptest = LabResult.objects.filter(exam_status='verified',results_date__month__gte=cmonth,results_date__year__gte=cyear).count()
        tltest = LabResult.objects.filter(receive_date__month__gte=cmonth,receive_date__year__gte=cyear).count()
        mostest= LabResult.objects.values_list('request_service__service_name').filter(results_date__month__gte=cmonth,results_date__year__gte=cyear).annotate(c=Count('request_service')).order_by('-c')
        ttrev=PatientBill.objects.filter(bill_point='laboratory',pay_status='paid',bill_date__month__gte=cmonth,bill_date__year__gte=cyear).aggregate(Sum('total_price'))['total_price__sum']
        villmost= PatientBioData.objects.values_list('residence').filter(register_date__month__gte=cmonth,register_date__year__gte=cyear).annotate(c=Count('residence')).order_by('-c')
        mstest = LabMissTest.objects.filter(missDate__month__gte=cmonth,missDate__year__gte=cyear).count()
        staff = LabResult.objects.filter(results_date__month__gte=cmonth,results_date__year__gte=cyear).distinct('performed_by').count()

        
        tname=mostest[0][0]
        tcount=mostest[0][1] 
        vname=villmost[0][0]
        vcount=villmost[0][1] 
        data = { 'ttp': ttpat,'cp':comptest,'tt':tltest,'tn':tname,'tc':tcount,'trev':ttrev,'vn':vname,'vc':vcount,'ms':mstest,'st':staff}
        return JsonResponse(data)


@login_required
def labfilterbrief(request):
    if request.method=="POST": 
        fdate=json.loads(request.body).get('fdate')
        tdate=json.loads(request.body).get('tdate')
       
        data={}
        try:
            ttpat = PatientBioData.objects.filter(register_date__range=[fdate,tdate]).count()        
            comptest = LabResult.objects.filter(exam_status='verified',results_date__range=[fdate,tdate]).count()
            tltest = LabResult.objects.filter(receive_date__range=[fdate,tdate]).count()
            mostest= LabResult.objects.values_list('request_service__service_name').filter(results_date__range=[fdate,tdate]).annotate(c=Count('request_service')).order_by('-c')
            ttrev=PatientBill.objects.filter(bill_point='laboratory',pay_status='paid',bill_date__range=[fdate,tdate]).aggregate(Sum('total_price'))['total_price__sum']
            villmost= PatientBioData.objects.values_list('residence').filter(register_date__range=[fdate,tdate]).annotate(c=Count('residence')).order_by('-c')
            mstest = LabMissTest.objects.filter(missDate__range=[fdate,tdate]).count()
            staff = LabResult.objects.filter(results_date__range=[fdate,tdate]).distinct('performed_by').count()

        
            tname=mostest[0][0]
            tcount=mostest[0][1] 
            vname=villmost[0][0]
            vcount=villmost[0][1] 
            data = { 'ttp': ttpat,'cp':comptest,'tt':tltest,'tn':tname,'tc':tcount,'trev':ttrev,'vn':vname,'vc':vcount,'ms':mstest,'st':staff}
        except  IndexError:
            data={'msg':'no data found'}

        return JsonResponse(data,safe=False)

@login_required
def labloadreport(request):
    if request.method=="POST": 
        fdate=json.loads(request.body).get('fdate')
        tdate=json.loads(request.body).get('tdate')
        rpname=json.loads(request.body).get('rpname')
        facprof=OpClinics.objects.filter()   ###facility profile not opclinics   
        fname=email=tel=loc=''
        for i in facprof:
            fname=i.facName
            email='Email: '+i.email
            tel='Tel: '+i.phoneNo
            loc=i.location
            contact=email+' '+tel
        
        data=[]
        dataprof=[]

        dataprof.append({
           'fn':fname,'ct':contact,'loc':loc 
        })

        try:
            if rpname =='workload':
                pass
            elif rpname=='register':
                result=LabResult.objects.select_related('request_reff_no','request_service','received_by','op_number').filter(exam_status='verified',receive_date__range=[fdate,tdate]).order_by('receive_date')
                if result:
                    for i in range(len(result)):
                        data.append({
                            'rcdate':result[i].receive_date,
                            'rctime':result[i].receive_time.strftime("%I:%M,%p"),
                            'opn':result[i].op_number.op_number,         
                            'spno':result[i].sampleNo,         
                            'pname':result[i].op_number.fullname,         
                            'page':result[i].op_number.patient_age,         
                            'pgender':result[i].op_number.gender,         
                            'vill':result[i].op_number.residence,         
                            'test':result[i].request_service.service_name,                           
                            'cost':result[i].request_service.normal_price,
                            'rsdate':result[i].results_date,                         
                            'rstime':result[i].results_time.strftime("%I:%M,%p"),                         
                            'vrby':result[i].confirmed_by.username,                         
                            })

                
            elif rpname=='tstlist':
                result=Services.objects.select_related('staff').filter(service_point='laboratory').order_by('service_name')
                if result:
                    for i in range(len(result)):
                        data.append({
                            'sname':result[i].service_name,
                            'cprice':result[i].normal_rate,
                            'sprice':result[i].scheme_rate,         
                            'staff':result[i].staff.username,
                            'dateadd':result[i].date_added,                         
                            })
                
            elif rpname=='analysis':
                pass
            elif rpname=='moh706':
                pass
            elif rpname=='stlevel':
                result = SubStoreItem.objects.values('itemCode').distinct('itemCode')
                if result:
                    data=[]
                    for i in range(len(result)):
                        itcode=result[i]['itemCode']
                        issqnt=0.0                       
                        itdetails = SubStoreItem.objects.filter(itemCode=itcode).values('itemCode__itemName','itemCode__package').distinct('itemCode')
                        
                        itsumst=SubStoreItem.objects.filter(itemCode=itcode).aggregate(Sum('itemBalance'))['itemBalance__sum']
                        itsumis=labItemRequest.objects.filter(itemCode=itcode,status='issued').aggregate(Sum('issueQuantity'))['issueQuantity__sum']
                        if itsumis==None:
                            issqnt=0.0
                        else:
                            issqnt=itsumis 
                        itsum=float(itsumst-issqnt)
                        data.append({
                                'itcode':itcode,
                                'itname':itdetails[0]['itemCode__itemName'],           
                                'pkg':itdetails[0]['itemCode__package'],
                                'itbal':itsum
                                }) 
                        
                    
            elif rpname=='stissue':
                result=labItemRequest.objects.select_related('itemCode','bench','requestBy','receiveBy','servedby').filter(status='issued',servedate__range=[fdate,tdate]).order_by('servedate')
                if result:
                    for i in range(len(result)):
                        data.append({
                            'svdate':result[i].requestDate, 
                            'item':result[i].itemCode.itemName,
                            'rqnt':result[i].requestQuant,
                            'bench':result[i].bench.departmentname,         
                            'rqby':result[i].requestBy.username,         
                            'irq':result[i].requestNo,         
                            'isqnt':result[i].issueQuant, 
                            'rcby':result[i].receiveBy.username,
                            'svby':result[i].servedby.username,                                                    
                            })
                
            elif rpname=='stdelivery':
                result=StoreDelivery.objects.select_related('supplierId','receivedBy','itemId').filter(receiveStatus='confirmed',receivedDate__range=[fdate,tdate]).order_by('receivedDate')
                if result:
                    for i in range(len(result)):
                        data.append({
                            'spdate':result[i].receivedDate, 
                            'spname':result[i].supplierId.supplierName,
                            'item':result[i].itemId.itemName,
                            'batch':result[i].batchNo,         
                            'pkgc':result[i].packageCount,         
                            'pkgp':result[i].packagePrice,         
                            'expd':result[i].expiryDate,         
                            'dlvnote':result[i].deliverlyNoteNo,         
                            'staff':result[i].receivedBy.username,
                                                    
                            })
            
            elif rpname=='supplist':
                result=Supplier.objects.select_related('addedBy').order_by('supplierName')
                if result:
                    for i in range(len(result)):
                        data.append({
                            'sname':result[i].supplierName,
                            'phone':result[i].phoneNo,
                            'email':result[i].emailAddress,         
                            'regno':result[i].registrationNo,         
                            'addr':result[i].physicalAddress,         
                            'status':result[i].accountStatus,         
                            'staff':result[i].addedBy.username,
                            'dateadd':result[i].dateAdded,                         
                            })
            elif rpname=='revenue':
                revenue=PatientBill.objects.select_related('service','staff').filter(bill_point='laboratory',pay_status='paid',bill_date__range=[fdate,tdate]).order_by('bill_date')
                
                if revenue:
                    for i in range(len(revenue)):
                        data.append({
                            'bdate':revenue[i].bill_date,
                            'test':revenue[i].service.service_name,
                            'cost':revenue[i].total_price,         
                            'status':revenue[i].pay_status,         
                            'billby':revenue[i].staff.username,                           
                                                   
                            })
                    ttrev=PatientBill.objects.filter(bill_point='laboratory',pay_status='paid',bill_date__range=[fdate,tdate]).aggregate(Sum('total_price'))['total_price__sum']
                   
                    data.append({
                            'sum':ttrev
                        })    
         
            cdata={'fdata':dataprof,'rdata':data,} 
            
        except  IndexError:
            data={'msg':'no data found'}

        return JsonResponse(cdata,safe=False)



@login_required
def addtest(request):
    if request.method=='POST': 
        userid=request.user.id

        labtest=Services()
        labtest.service_point = 'laboratory' 
        labtest.service_name = request.POST.get('service_name')
        labtest.normal_price = request.POST.get('normal_rate')
        labtest.scheme_price = request.POST.get('scheme_rate')
        labtest.staff =  CustomUser.objects.get(id=userid)
        labtest.status = request.POST.get('status')
        labtest.save()
        data = {'msg':'added successfully'}
    return JsonResponse(data,safe=False)


@login_required
def edittest(request):
    if request.method=='POST': 
        userid=request.user.id

        labtest=Services.objects.get(scode=request.POST.get('testid'))        
        labtest.service_name = request.POST.get('service_name')
        labtest.normal_rate = request.POST.get('normal_rate')
        labtest.scheme_rate = request.POST.get('scheme_rate')
        labtest.staff =  CustomUser.objects.get(id=userid)
        labtest.status = request.POST.get('status')
        labtest.save()
        data = {'msg':'updated successfully'}
    return JsonResponse(data,safe=False)


@login_required
def labtestlist(request):
    if request.method == 'POST':        
        result = Services.objects.filter(service_point='laboratory').order_by('service_name')            
        data=list(result.values('scode','service_name',))   

        return JsonResponse(data, safe=False) 

@login_required
def labtestParam(request):
     if request.method == 'POST':     
        tid = json.loads(request.body).get('searchText')   
        result = LabTestParameter.objects.filter(test_id=tid,status='Active').order_by('param_no')
        data=[]         
        if result:
            for i in range(len(result)):
                data.append({
                    'prno':result[i].param_no,
                    'prtname':result[i].param_name,
                    'lower':result[i].lower_limit,         
                    'upper':result[i].upper_limit,
                    'msunit':result[i].value_units,
                    'psrst':result[i].posible_result,
                    })
      
        return JsonResponse(data, safe=False)


@login_required
def dormantparam(request):
    if request.method=='POST': 
        userid=request.user.id
        prid = json.loads(request.body).get('prno')##request.POST.get('testid')
        labtest=LabTestParameter.objects.get(param_no=prid)
        labtest.status = 'dormant'
        labtest.added_by = CustomUser.objects.get(id=userid)       
        labtest.save()
        data = {'msg':'updated successfully'}
    return JsonResponse(data,safe=False)


@login_required
def labparamadd(request):
    if request.method=='POST': 
        userid=request.user.id  
        paramt=LabTestParameter()   

        paramt.test_id =Services.objects.get(scode=request.POST.get('testmno'))         
        paramt.param_name = request.POST.get('prmname') 
        paramt.lower_limit = request.POST.get('lwlimit')
        paramt.upper_limit =request.POST.get('uplimit') 
        paramt.value_units =request.POST.get('msunits') 
        paramt.posible_result=request.POST.get('psOutcome')
        paramt.param_type =request.POST.get('rstformv') 
        paramt.status ='Active' 
        paramt.added_by =  CustomUser.objects.get(id=userid)              
        paramt.save()        
        data = {'msg':'Added successfully'}
    return JsonResponse(data,safe=False)


@login_required
def confirmparamlist(request):
    if request.method=='POST':
        prmlist=json.loads(request.body)
        userid=request.user.id
        pb=prmlist["paramarray"] #it is the only main item in the dictionary          
        prmlistLength=len(pb) 
        if prmlistLength >0 :      
            for i in range(prmlistLength):
                psrst=pb[i]["psrst"]
                paramdet = LabTestParameter.objects.get(param_no = pb[i]["prid"]) 
                paramdet.param_name=pb[i]["prname"]
                if psrst =='values':
                    paramdet.lower_limit=pb[i]["llimit"]                    
                    paramdet.upper_limit=pb[i]["ulimit"]                    
                    paramdet.value_units=pb[i]["unit"]
                elif psrst =='options':
                    paramdet.posible_result=pb[i]["psbval"]                                    
                          
                paramdet.added_by= CustomUser.objects.get(id=userid)
                paramdet.save()

        data={'msg':'confirmed successfully'}
        return JsonResponse(data, safe=False)
    



def walkin(request):
    patType = PatientType.objects.all()
    wlkno='000000'

    context={
        'patType':patType,
    }
    return render(request,'dashboard/laboratory/lab_walkin.html',context)


@login_required
def save_bill(request):
    if request.method =='POST':
        # get wlk number
        """ wkno=wlknumber.objects.all()
        wkno_latest=0
        for i in range(len(wkno)):
            wkno_latest=wkno[i].wlkno

        wlkno="wlk"+str(wkno_latest)

        #once you get update count
        wkno_update=wlknumber.objects.get(Id=1)
        wkno_update.wlkno=wkno_latest+1
        wkno_update.save() """


        bill=json.loads(request.body)
        pb=bill["bill"]   

        for i in range(len(pb)):

            billInfo = PatientBill()
            pym=pb[i]["pym"]
            billInfo.op_number=PatientBioData.objects.get(op_number=pb[i]["pid"])
            billInfo.paymode=pym
            billInfo.patient_type=pb[i]["ptype"]
            billInfo.bill_point=pb[i]["dpt"]
            billInfo.service=Services.objects.get(scode = pb[i]["code"])
            if pb[i]["ptype"]=='In-Patient':
                billInfo.visitNoIp=IpVisit.objects.get(visitId = pb[i]["vno"])
            else:
                billInfo.visitNo=OpVisits.objects.get(visitNo = pb[i]["vno"])            
            billInfo.quantity=pb[i]["qnt"]
            billInfo.total_price=pb[i]["cost"]
            if pym=='cash':
                billInfo.pay_status='billed'
            else:
                billInfo.pay_status='paid'
            billInfo.visitStatus='open'
            billInfo.status='pending'   
            billInfo.billed_by=CustomUser.objects.get(id=request.user.id)
            billInfo.save()        
        
        """ #record patient details in wlkpatient table
        wlkpat=wlkpatient()
        wlkpat.wlkno=wlkno
        wlkpat.fullname=pname
        wlkpat.department=dpt
        wlkpat.services=svs
        wlkpat.registered_by=user.objects.get(id=request.user.id)
        wlkpat.save() """

        res = {
            'msg':'bill sent successfully'
        }
        return JsonResponse(res,safe=False)
    

def checkHighValues(request):
    if request.method=='GET':
        res=[]
        query=LabResult.objects.filter(request_service_id=81)
        for i in range(len(query)):
            res.append({
                'kval':query[i].result_value
            })
        
        keyVal = 'hba1c'

        # load the json data
        cst = json.dumps(res)
        customer = json.loads(cst)
        # Search the key value using 'in' operator
        if keyVal in customer:
            # Print the success message and the value of the key
            print("%s is found in JSON data" %keyVal)
            print("The value of", keyVal,"is", customer[keyVal])
        else:
            # Print the message if the value does not exist
            print("%s is not found in JSON data" %keyVal)

    return JsonResponse(res,safe=False)



@login_required
def savebenchtest(request):
    if request.method=='POST':
        testid=json.loads(request.body).get('tsid')
        deptid=json.loads(request.body).get('dptid')

        checktest=LabDepartmentTest.objects.filter(testname=testid)
        if checktest.exists():
            sql=LabDepartmentTest.objects.get(testname=testid)
            sql.departmentname=labDepartment.objects.get(departmentid=deptid)
            sql.createby=CustomUser.objects.get(id=request.user.id)
            sql.entryDate=datetime.now()
            sql.save()
            data = {'res':'Test configuration updated successfully'}
        
        else:
            sql=LabDepartmentTest()
            sql.departmentname=labDepartment.objects.get(departmentid=deptid)
            sql.testname=Services.objects.get(scode=testid)
            sql.createby=CustomUser.objects.get(id=request.user.id)
            sql.entryDate=datetime.now()
            sql.save()
            data = {'res':'Test configuration saved successfully'}

        return JsonResponse(data,safe=False)

    
@login_required
def benchtestlist(request):
    data=[]
    sql=LabDepartmentTest.objects.all().order_by('departmentname__departmentname','testname__service_name')
    for i in range(len(sql)):
        data.append({
            'entid':sql[i].entryno,
            'deptname':sql[i].departmentname.departmentname,
            'testname':sql[i].testname.service_name,         
            'staff':sql[i].createby.username,
            'cdate':sql[i].entryDate.strftime('%Y-%m-%d(%I:%M%p)'),
        })

    return JsonResponse(data,safe=False)


@login_required
def savebench(request):
    if request.method=='POST':
        depname=json.loads(request.body).get('dptname')
        deptdesc=json.loads(request.body).get('dptdesc')

        sql=labDepartment()
        sql.departmentname=depname
        sql.description=deptdesc
        sql.createby=CustomUser.objects.get(id=request.user.id)
        sql.save()
        data = {'res':'Bench added successfully'}

        return JsonResponse(data,safe=False)
    

@login_required
def updatebench(request):
    if request.method=='POST':
        did=json.loads(request.body).get('did')
        depname=json.loads(request.body).get('dptname')
        deptdesc=json.loads(request.body).get('dptdesc')

        sql=labDepartment.objects.get(departmentid=did)
        sql.departmentname=depname
        sql.createby=CustomUser.objects.get(id=request.user.id)
        sql.DateCreated=datetime.now()
        sql.description=deptdesc
        sql.save()
        data = {'res':'Bench updated successfully'}

        return JsonResponse(data,safe=False)


@login_required
def benchlist(request):
    data=[]
    sql=labDepartment.objects.all().order_by('departmentname')
    for i in range(len(sql)):
        data.append({
            'did':sql[i].departmentid,
            'deptname':sql[i].departmentname,        
            'descp':sql[i].description,        
            'staff':sql[i].createby.username,
            'cdate':sql[i].DateCreated.strftime('%Y-%m-%d(%I:%M%p)'),
        })

    return JsonResponse(data,safe=False)

