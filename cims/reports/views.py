from django.shortcuts import render
from django.http import JsonResponse,HttpResponse
from django.contrib.auth.decorators import login_required
from sysadmin.models import facdepartment
from .models import deptReport
import json
from django.db.models import Count, Sum,F
from MedicalRecords.models import *
from finance.models import *
from pharmacy.models import *
from consultation.models import Prescription 
from laboratory.models import *
from radiology.models import *
from stores.models import *
from datetime import timedelta
import datetime
import csv
import xlwt

# pdf imports
from django.template.loader import render_to_string
from weasyprint import HTML
import tempfile

from datetime import date
from dateutil.rrule import rrule, DAILY


import collections
import functools
import operator




@login_required
def report_page(request):
    depts=facdepartment.objects.filter().values().order_by('deptName')
    strs=Store.objects.filter().values().order_by('store_name')
    context={
        'depts':depts,
        'stores':strs,
    }   
    return render(request, 'dashboard/reports/report.html', context)

@login_required
def report_name(request):
    if request.method=='POST':
        deptname = json.loads(request.body).get('searchText')    
        sql=deptReport.objects.filter(departmentName=deptname).values().order_by('reportName')
        return JsonResponse(list(sql),safe=False)

@login_required
def exportcsv(request):
    response=HttpResponse(content_type='text/csv')
    response['Content-Disposition']='attachement; filename= report'+str(datetime.now())+'.csv'
    writer=csv.writer(response)
    writer.writerow(['col_title1','col_title2','col_title3','col_title4'])
    #sql=models.objects.filter().order_by()
    #for i in sql:
        #writer.writerow([sql.col1,sql.col2,sql.col3,sql.col4])
    return response


@login_required
def exportexcel(request):
    response=HttpResponse(content_type='application/ms-excel')
    response['Content-Disposition']='attachement; filename= report'+str(datetime.now())+'.xls'
    workbook=xlwt.Workbook(encoding='utf-8')
    worksheet=workbook.add_sheet('sheetname')
    row_num=0
    font_style=xlwt.XFStyle()
    font_style.font.bold=True

    columns=['col_title1','col_title2','col_title3','col_title4']
    for col in range(len(columns)):
        worksheet.write(row_num,col,columns[col],font_style)

    font_style=xlwt.XFStyle()
    #sql=models.objects.filter().values_list('col1','col2','col3','col4')
    # for sq in sql:
    #   row_num+=1  
        #for i in range(len(sql)):
            #worksheet.write(row_num,i,str(sq[i]),font_style)
    # workbook.save(reponse) 
    return response 

def exportpdf(request):
    response=HttpResponse(content_type='application/pdf')
    response['Content-Disposition']='inline; attachement; filename= report'+str(datetime.now())+'.pdf' 
    sql=models.objects.filter()
    tt=sql.aggregate(Sum("total"))
    html_string=render_to_string('dashboard/reports/pdf_output.html',{'data':[sql],'total':tt['total__sum']}) 
    html=HTML(string=html_string)
    result=html.write_pdf()

    with tempfile.NamedTemporaryFile(delete=True) as output:
        output.write(result)
        output.flush()

        output=open(output.name,'rb')
        response.write(output.read())

    return response










def generate_report(request):
    if request.method=='POST':
        rpname = json.loads(request.body).get('repname')    
        dtfrom = json.loads(request.body).get('dtf')    
        dtto = json.loads(request.body).get('dtt')

        #tdate = datetime.datetime.strptime(json.loads(request.body).get('tdate'), '%Y-%m-%d')
        #todate=tdate + timedelta(hours=23,minutes=59,seconds=59)
        stid = json.loads(request.body).get('stid') 

        data=[]
        if rpname=='1':
            data={'cardno':'1111'}
        
        elif rpname=='2':
            data={'cardno':'1111'}
        
        elif rpname=='3':
            data={'cardno':'1111'}

        elif rpname=='4':
            data={'cardno':'1111'}
        
        elif rpname=='5':
            data={'cardno':'1111'}

        elif rpname=='6':
            data={'cardno':'1111'}
        
        elif rpname=='7':
            data={'cardno':'1111'}

        elif rpname=='8':
            data={'cardno':'1111'}
        
        elif rpname=='9':
            data={'cardno':'1111'}

    
        elif rpname=='10':
            data={'cardno':'1111'}
        
        elif rpname=='11':
            data={'cardno':'1111'}

        elif rpname=='12':
            data={'cardno':'1111'}
        
        elif rpname=='13':
            data={'cardno':'1111'}

        elif rpname=='14':
            data={'cardno':'1111'}
        
        elif rpname=='15':
            data={'cardno':'1111'}

        elif rpname=='16':###op register
            sql =OpVisits.objects.select_related('op_number','clinic_name','subname').filter(visit_date__range=[dtfrom,dtto]).order_by('visit_date','visit_time')
            ttvisit =OpVisits.objects.filter(visit_date__range=[dtfrom,dtto]).count()
            cash =OpVisits.objects.filter(visit_date__range=[dtfrom,dtto],paymode='Non-scheme').count()
            scheme =OpVisits.objects.filter(visit_date__range=[dtfrom,dtto],paymode='Scheme').count()
            newp =OpVisits.objects.filter(visit_date__range=[dtfrom,dtto],visit_type='newPatient').count()
            revp =OpVisits.objects.filter(visit_date__range=[dtfrom,dtto],visit_type='revisit').count()
            pcount =OpVisits.objects.filter(visit_date__range=[dtfrom,dtto]).distinct('op_number').count()


            if sql:
                for i in range(len(sql)):
                    data.append({
                        'date':sql[i].visit_date,
                        'time':sql[i].visit_time.strftime("%I:%M:%S%p"),
                        'cardno':sql[i].op_number.op_number,
                        'name':sql[i].op_number.fullname,
                        'age':sql[i].op_number.patient_age,
                        'gend':sql[i].op_number.gender,
                        'phone':sql[i].op_number.patient_phone,
                        'idno':sql[i].op_number.national_idno,
                        'nokph':sql[i].op_number.nok_phone,
                        'resd':sql[i].op_number.residence,
                        'cli':sql[i].clinic_name.clinic_name,
                        'pym':sql[i].subname.sub_name,
                        'reg':sql[i].staff.username,
                        'ttv':ttvisit,
                        'cash':cash,
                        'sch':scheme,
                        'pcnt':pcount,
                        'newp':newp,
                        'revp':revp,
                    })
                   
        elif rpname=='17':
            data={'cardno':'1111'}

    
        elif rpname=='18':##departmental attendance
            dates=[]
            days=[]
            clname=[]
            countv=[]
            combined=[]

            start_date = datetime.fromisoformat(dtfrom)
            end_date =  datetime.fromisoformat(dtto)

            clinics=OpClinics.objects.all()            

            for d in rrule(DAILY, dtstart=start_date, until=end_date):
                dte=d.strftime("%Y-%m-%d")
                day=d.strftime("%d")
                dates.append(dte)
                days.append(day)               

            for i in range(len(clinics)):                
                clname.append(clinics[i].clinic_name)
                
            for dte in dates:
                i=0
                ddte=dte
                cnt=0
                cll=''

                while(i<len(clname)):
                    cll=clname[i]
                    sql=OpVisits.objects.filter(visit_date=dte,clinic_name__clinic_name=clname[i]).count()
                    cnt=sql
                    i+=1

                countv.append({
                        cll:{ddte,cnt}
                    })

            #for clinic in clname:  

            data={'counts':countv}
        
        elif rpname=='19': ###admissions
            
            sql =IpVisit.objects.select_related('ipNumber','wardName','subname').filter(admissionDate__range=[dtfrom,dtto],admStatus='active').order_by('admissionDate','admissionTime')
            nadm =IpVisit.objects.filter(admissionDate__range=[dtfrom,dtto],visitType='newAdm',admStatus='active').count()
            radm =IpVisit.objects.filter(admissionDate__range=[dtfrom,dtto],visitType='readm',admStatus='active').count()
            ttadm =IpVisit.objects.filter(admissionDate__range=[dtfrom,dtto],admStatus='active').count()
            ptcnt =IpVisit.objects.filter(admissionDate__range=[dtfrom,dtto],admStatus='active').distinct('ipNumber').count()
            if sql:
                for i in range(len(sql)):
                    data.append({
                        'date':sql[i].admissionDate,
                        'time':sql[i].admissionTime.strftime("%I:%M:%S%p"),
                        'cardno':sql[i].ipNumber.op_number,
                        'name':sql[i].ipNumber.fullname,
                        'age':sql[i].ipNumber.patient_age,
                        'gend':sql[i].ipNumber.gender,
                        'phone':sql[i].ipNumber.patient_phone,                        
                        'nokph':sql[i].ipNumber.nok_phone,
                        'resd':sql[i].ipNumber.residence,
                        'cli':sql[i].wardName.wardName,
                        'pym':sql[i].subname.sub_name,
                        'atype':sql[i].visitType,
                        'reg':sql[i].admittedBy.username,
                        'nadm':nadm,                    
                        'radm':radm,                    
                        'ttadm':ttadm,                    
                        'ptcnt':ptcnt,                    
                    })

        elif rpname=='20':
            sql =IpVisit.objects.select_related('ipNumber','wardName','subname').filter(dischargeDate__range=[dtfrom,dtto],admStatus='discharged').order_by('dischargeDate','dischargeTime')
            
            ptcnt =IpVisit.objects.filter(dischargeDate__range=[dtfrom,dtto],admStatus='discharged').distinct('ipNumber').count()
            ttd =IpVisit.objects.filter(dischargeDate__range=[dtfrom,dtto],admStatus='discharged').count()
            if sql:
                for i in range(len(sql)):
                    data.append({
                        'date':sql[i].dischargeDate,
                        'time':sql[i].dischargeTime.strftime("%I:%M:%S%p"),
                        'cardno':sql[i].ipNumber.op_number,
                        'name':sql[i].ipNumber.fullname,
                        'age':sql[i].ipNumber.patient_age,
                        'gend':sql[i].ipNumber.gender,
                        'phone':sql[i].ipNumber.patient_phone,                        
                        'nokph':sql[i].ipNumber.nok_phone,
                        'resd':sql[i].ipNumber.residence,
                        'cli':sql[i].wardName.wardName,
                        #'pym':sql[i].subname.sub_name,
                        'cnd':sql[i].DischargeStatus,
                        'reg':sql[i].dischargeBy.username,                                          
                        'ptcnt':ptcnt,                    
                        'ttd':ttd,                    
                    })
        
        elif rpname=='21':
            data={'cardno':'1111'}

        elif rpname=='22':
            data={'cardno':'1111'}
        
        elif rpname=='23':
            data={'cardno':'1111'}

        elif rpname=='24':
            data={'cardno':'1111'}
        
        elif rpname=='25':
            data={'cardno':'1111'}

        elif rpname=='26':
            data={'cardno':'1111'}
        
        elif rpname=='27':
            data={'cardno':'1111'}

        elif rpname=='28':
            data={'cardno':'1111'}
        
        elif rpname=='29':
            data={'cardno':'1111'}

        elif rpname=='30':
            data={'cardno':'1111'}
        
        elif rpname=='31':
            data={'cardno':'1111'}

        elif rpname=='32':
            data={'cardno':'1111'}
        
        elif rpname=='33':
            data={'cardno':'1111'}

        elif rpname=='34':
            data={'cardno':'1111'}
        
        elif rpname=='35':
            data={'cardno':'1111'}

        elif rpname=='36':
            tdate = datetime.datetime.strptime(dtto, '%Y-%m-%d')
            todate=tdate + timedelta(hours=23,minutes=59,seconds=59)
            
            list=cashierReceipt.objects.filter(trans_date__range=[dtfrom,todate]).order_by('cashier','trans_date')
            ttsum=cashierReceipt.objects.filter(trans_date__range=[dtfrom,todate]).aggregate(Sum('paid_amount'))['paid_amount__sum']
            for i in range(len(list)):
                data.append({
                    'staff':list[i].cashier.username,
                    'date':list[i].trans_date,
                    'rctno':list[i].receipt_no,
                    'ptno':list[i].pat_card.op_number,
                    'ptname':list[i].pat_card.fullname,
                    'svs':list[i].billReffNo.service.service_name,
                    'qnt':list[i].billReffNo.quantity,
                    'ttp':list[i].paid_amount,                    
                    'ttsum':ttsum
                    })
        
        elif rpname=='37':#Total shifts
            cashiers=[]
            tdate = datetime.datetime.strptime(dtto, '%Y-%m-%d')
            todate=tdate + timedelta(hours=23,minutes=59,seconds=59)
            sql=cashierReceipt.objects.filter(trans_date__range=[dtfrom,todate]).distinct('cashier')
            if sql:
                for i in range(len(sql)):
                    cashiers.append({
                        
                        'id':sql[i].cashier.id,
                        'name':sql[i].cashier.username,
                        })

            
                for i in range(len(cashiers)):
                    stt=cashiers[i]['id']
                    sttn=cashiers[i]['name']
                    tsum=cashierReceipt.objects.filter(trans_date__range=[dtfrom,todate],cashier=stt).aggregate(Sum('paid_amount'))['paid_amount__sum']
                    ttsum=cashierReceipt.objects.filter(trans_date__range=[dtfrom,todate]).aggregate(Sum('paid_amount'))['paid_amount__sum']
                    data.append({
                        'cashier':sttn,
                        'ttrev':tsum,
                        'ttsum':ttsum
                    })

        elif rpname=='38':
            tdate = datetime.datetime.strptime(dtto, '%Y-%m-%d')
            todate=tdate + timedelta(hours=23,minutes=59,seconds=59)
            list=cashierReceipt.objects.filter(trans_date__range=[dtfrom,todate],trans_type='paid').order_by('-receipt_no').distinct('receipt_no')           
            ttsum=cashierReceipt.objects.filter(trans_date__range=[dtfrom,todate],trans_type='paid').aggregate(Sum('paid_amount'))['paid_amount__sum']
            for i in range(len(list)):
                rcpt_total=cashierReceipt.objects.filter(receipt_no=list[i].receipt_no).aggregate(Sum('paid_amount'))['paid_amount__sum']                
                if rcpt_total !=0.0:
                    data.append({
                        'staff':list[i].cashier.username,
                        'date':list[i].trans_date.strftime("%Y-%m-%d %I:%M %p"),
                        'rctno':list[i].receipt_no,
                        'ptno':list[i].pat_card.op_number,
                        'ptname':list[i].pat_card.fullname,
                        'pmode':list[i].paymode,
                        'tid':list[i].mobile_trans_no,
                        'ttp':rcpt_total,                    
                        'ttsum':ttsum
                        })                
        
        elif rpname=='39':
            data={'cardno':'1111'}

        elif rpname=='40':
            data={'cardno':'1111'}
        
        elif rpname=='41':
            data={'cardno':'1111'}

        elif rpname=='42':## departmental revenue
            tdate = datetime.datetime.strptime(dtto, '%Y-%m-%d')
            todate=tdate + timedelta(hours=23,minutes=59,seconds=59)
            sql=cashierReceipt.objects.filter(trans_date__range=[dtfrom,todate]).values('billReffNo__bill_point').annotate(total=Sum('paid_amount')).order_by('-paid_amount')
            ttsum=cashierReceipt.objects.filter(trans_date__range=[dtfrom,todate]).aggregate(Sum('paid_amount'))['paid_amount__sum']
            
            raw_data=[]
            if sql:
                for i in range(len(sql)):                    
                    raw_data.append({
                        sql[i]['billReffNo__bill_point']:int(sql[i]['total'])
                    })
                raw_data.append({'Totals':ttsum})

                data = dict(functools.reduce(operator.add,map(collections.Counter, raw_data)))
                            
            
        
        elif rpname=='43':
            data={'cardno':'1111'}

        elif rpname=='44':
            data={'cardno':'1111'}
        
        elif rpname=='45':
            data={'cardno':'1111'}

        elif rpname=='46':
            data={'cardno':'1111'}
        
        elif rpname=='47':
            data={'cardno':'1111'}

        elif rpname=='48':
            data={'cardno':'1111'}
        
        elif rpname=='49':
            data={'cardno':'1111'}

        elif rpname=='50':
            data={'cardno':'1111'}
        
        elif rpname=='51':
            data={'cardno':'1111'}

        elif rpname=='52':### lab register moh 204
            sql=LabResult.objects.filter(results_date__range=[dtfrom,dtto],exam_status='verified').order_by('results_date')
            ttests=LabResult.objects.filter(results_date__range=[dtfrom,dtto],exam_status='verified').count()
            ttpat=LabResult.objects.filter(results_date__range=[dtfrom,dtto],exam_status='verified').distinct('op_number').count()
            
            for i in range(len(sql)):
                data.append({
                    'rdate':sql[i].receive_date,
                    'rtime':sql[i].receive_time.strftime("%I:%M:%S%p"),
                    'vno':'',#sql[i].request_reff_no.op_number,
                    'pno':sql[i].op_number.op_number,
                    'pname':sql[i].op_number.fullname,
                    'phone':sql[i].op_number.patient_phone,
                    'age':sql[i].op_number.patient_age,
                    'gend':sql[i].op_number.gender,
                    'resd':sql[i].op_number.residence,
                    'diag':'',                     
                    'stype':'',                    
                    'test':sql[i].request_service.service_name,                    
                    'recvdate':sql[i].receive_date,                    
                    'doctor':sql[i].request_reff_no.billed_by.username,                   
                    'res':str(sql[i].result_value),
                    'resdate':sql[i].results_date,
                    'restime':sql[i].results_time.strftime("%I:%M:%S%p"),
                    'price':sql[i].request_reff_no.total_price,
                    'lbtech':sql[i].performed_by.username,
                    'tests':ttests,
                    'ttpat':ttpat,
                })
        
        elif rpname=='53':
            data={'cardno':'1111'}

        elif rpname=='54':
            data={'cardno':'1111'}
        
        elif rpname=='55':
            data={'cardno':'1111'}

        elif rpname=='56':
            data={'cardno':'1111'}
        
        elif rpname=='57':
            data={'cardno':'1111'}

        elif rpname=='58':
            data={'cardno':'1111'}
        
        elif rpname=='59':
            data={'cardno':'1111'}

        elif rpname=='60':
            data={'cardno':'1111'}    

        elif rpname=='61':### radiology register moh 209
            sql=ExamResult.objects.filter(receive_date__range=[dtfrom,dtto],exam_status='complete').order_by('receive_date')
            ttests=ExamResult.objects.filter(receive_date__range=[dtfrom,dtto],exam_status='complete').count()
            ttpat=ExamResult.objects.filter(receive_date__range=[dtfrom,dtto],exam_status='complete').distinct('op_number').count()
            
            for i in range(len(sql)):
                data.append({
                    'rdate':sql[i].receive_date,
                    'rtime':sql[i].receive_time.strftime("%I:%M:%S%p"),
                    'vno':'',#sql[i].request_reff_no.op_number,
                    'pno':sql[i].op_number.op_number,
                    'pname':sql[i].op_number.fullname,
                    'phone':sql[i].op_number.patient_phone,
                    'age':sql[i].op_number.patient_age,
                    'gend':sql[i].op_number.gender,
                    'resd':sql[i].op_number.residence,
                    'diag':'',         
                    'test':sql[i].request_service.service_name,                    
                    'doctor':sql[i].request_reff_no.billed_by.username,
                    'resdate':sql[i].exam_notes_date,
                    'restime':sql[i].exam_notes_time.strftime("%I:%M:%S%p"),
                    'price':sql[i].request_reff_no.total_price,
                    'rdtech':sql[i].notes_by.username,
                    'sign':'',
                    'tests':ttests,
                    'ttpat':ttpat,
                })
        
        elif rpname=='62':
            data={'cardno':'1111'}
        
        elif rpname=='63':##Prescriptions
            
            sql=Prescription.objects.filter(prescDate__range=[dtfrom,dtto],status='pending').order_by('prescDate')
            ttpresc=Prescription.objects.filter(prescDate__range=[dtfrom,dtto],status='pending').count()
            
            for i in range(len(sql)):
                data.append({
                    'pdate':sql[i].prescDate,
                    'ptime':sql[i].prescTime.strftime("%I:%M:%S%p"),
                    'pno':sql[i].opNumber.op_number,
                    'pname':sql[i].opNumber.fullname,
                    'age':sql[i].opNumber.patient_age,
                    'drug':sql[i].itemCode.itemName,                    
                    'dos':sql[i].dosage,                    
                    'freq':sql[i].frequency,                    
                    'days':sql[i].days,                    
                    'qnt':sql[i].quantity,                    
                    'store':sql[i].storeId.store_name,
                    'staff':sql[i].doctor.username,                    
                    'ttpresc':ttpresc,
                })

        elif rpname=='64':
            tdate = datetime.datetime.strptime(dtto, '%Y-%m-%d')
            todate=tdate + timedelta(hours=23,minutes=59,seconds=59)
            sql=PharmDispense.objects.filter(DispenseDate__range=[dtfrom,todate],status='OS').order_by('DispenseDate')
            ttpat=PharmDispense.objects.filter(DispenseDate__range=[dtfrom,todate],status='OS').distinct('patnumber').count()
            
            for i in range(len(sql)):
                data.append({
                    'ddate':sql[i].DispenseDate,
                    'pno':sql[i].patnumber.op_number,
                    'pname':sql[i].patnumber.fullname,
                    'age':sql[i].patnumber.patient_age,
                    'drug':sql[i].drug_item.itemName,                    
                    'qnt':sql[i].quant,                    
                    'store':sql[i].store.store_name,
                    'staff':sql[i].pharmacist.username,                    
                    'ttpat':ttpat,
                })
        
        elif rpname=='65':#pharmacy dispensation
            tdate = datetime.datetime.strptime(dtto, '%Y-%m-%d')
            todate=tdate + timedelta(hours=23,minutes=59,seconds=59)
            sql=PharmDispense.objects.filter(DispenseDate__range=[dtfrom,todate],status='dispensed').order_by('DispenseDate')
            ttsum=PharmDispense.objects.filter(DispenseDate__range=[dtfrom,todate],status='dispensed').aggregate(Sum('total_price'))['total_price__sum']
            ttpat=PharmDispense.objects.filter(DispenseDate__range=[dtfrom,todate],status='dispensed').distinct('patnumber').count()
            
            for i in range(len(sql)):
                data.append({
                    'ddate':sql[i].DispenseDate,
                    'pno':sql[i].patnumber.op_number,
                    'pname':sql[i].patnumber.fullname,
                    'age':sql[i].patnumber.patient_age,
                    'drug':sql[i].drug_item.itemName,
                    'dos':sql[i].dosage,
                    'freq':sql[i].frequency,
                    'days':sql[i].days,
                    'qnt':sql[i].quant,
                    'price':sql[i].total_price,
                    'rcp':sql[i].receipt_no,
                    'inv':sql[i].invoice_no,
                    'store':sql[i].store.store_name,
                    'staff':sql[i].pharmacist.username,
                    'ttrev':ttsum,
                    'ttpat':ttpat,
                })
        elif rpname=='66':
            data={'cardno':'1111'}
        
        elif rpname=='67':
            data={'cardno':'1111'}

        elif rpname=='68':
            data={'cardno':'1111'}
        
        elif rpname=='69':
            data={'cardno':'1111'}

        elif rpname=='70':
            data={'cardno':'1111'}
        
        elif rpname=='71':# stock prices
            sql=SubStoreItem.objects.filter(storeId=stid,status='Active').order_by('-itemCode__itemCategory','itemCode__itemName')
            for i in range(len(sql)):
                data.append({                   
                   'itname':sql[i].itemCode.itemName,
                   'cprice':sql[i].normalPrice,
                   'sprice':sql[i].specialPrice,
                   })
                   

        elif rpname=='72': #store deliveries
            sql=StoreDelivery.objects.filter(receivedDate__range=[dtfrom,dtto],receiveStatus='confirmed').order_by('receivedDate')
            ttval=StoreDelivery.objects.filter(receivedDate__range=[dtfrom,dtto],receiveStatus='confirmed').aggregate(Sum('packagePrice'))['packagePrice__sum']  
            for i in range(len(sql)):
                data.append({
                    'ddate':sql[i].receivedDate,
                    'store':sql[i].storeId.store_name,
                    'supp':sql[i].supplierId.supplierName,
                    'itname':sql[i].itemId.itemName,
                    'pkg':sql[i].packageUnit,                    
                    'pkgc':sql[i].packageCount,                    
                    'pkgcn':sql[i].noItemsInPackage,                    
                    'pval':sql[i].packagePrice,                    
                    'dnote':sql[i].deliverlyNoteNo,                    
                    'delby':sql[i].deliverlyBy,
                    'recby':sql[i].receivedBy.username,                    
                    'ttval':ttval,
                })

        
        elif rpname=='73':
            data={'cardno':'1111'}

        elif rpname=='74':
            data={'cardno':'1111'}
        
        elif rpname=='75':
            data={'cardno':'1111'}

        elif rpname=='76':
            data={'cardno':'1111'}
        
        elif rpname=='77':
            data={'cardno':'1111'}

        elif rpname=='78':
            data={'cardno':'1111'}
        
        elif rpname=='79':
            data={'cardno':'1111'}

        elif rpname=='80':
            data={'cardno':'1111'}
        
        elif rpname=='81':
            data={'cardno':'1111'}

        elif rpname=='82':
            data={'cardno':'1111'}
        
        elif rpname=='83':
            data={'cardno':'1111'}

        elif rpname=='84':
            data={'cardno':'1111'}
        
        elif rpname=='85':
            data={'cardno':'1111'}

        elif rpname=='86':
            data={'cardno':'1111'}
        
        elif rpname=='89':
            data={'cardno':'1111'}

        elif rpname=='90':
            data={'cardno':'1111'}
        
        elif rpname=='91':
            data={'cardno':'1111'}

        elif rpname=='92':
            data={'cardno':'1111'}
        
        elif rpname=='93':
            data={'cardno':'1111'}

        elif rpname=='94':
            data={'cardno':'1111'}
        
        elif rpname=='95':
            data={'cardno':'1111'}

        elif rpname=='96':
            data={'cardno':'1111'}
        
        elif rpname=='97':
            data={'cardno':'1111'}

        elif rpname=='98':
            data={'cardno':'1111'}
        
        elif rpname=='99':
            data={'cardno':'1111'}

        elif rpname=='100':
            data={'cardno':'1111'}
        
        elif rpname=='101':
            data={'cardno':'1111'}

        elif rpname=='102':
            data={'cardno':'1111'}
        
        elif rpname=='103':
            data={'cardno':'1111'}

        elif rpname=='104':
            data={'cardno':'1111'}
        
        elif rpname=='105':
            data={'cardno':'1111'}

        elif rpname=='106':
            data={'cardno':'1111'}
        
        elif rpname=='107':
            data={'cardno':'1111'}

        elif rpname=='108':
            data={'cardno':'1111'}
        
        elif rpname=='109':
            data={'cardno':'1111'}

        elif rpname=='110':
            data={'cardno':'1111'}
        
        elif rpname=='111':
            data={'cardno':'1111'}

        elif rpname=='112':
            data={'cardno':'1111'}
        
        elif rpname=='113':
            data={'cardno':'1111'}

        elif rpname=='114':
            data={'cardno':'1111'}
        
        elif rpname=='115':
            data={'cardno':'1111'}

        elif rpname=='116':
            data={'cardno':'1111'}
        
        elif rpname=='117':
            data={'cardno':'1111'}

        elif rpname=='118':
            data={'cardno':'1111'}
        
        elif rpname=='119':
            data={'cardno':'1111'}

        elif rpname=='120':
            data={'cardno':'1111'}
        
        elif rpname=='121':
            data={'cardno':'1111'}

        elif rpname=='122':
            data={'cardno':'1111'}
        
        elif rpname=='123':
            data={'cardno':'1111'}

        elif rpname=='124':
            data={'cardno':'1111'}
        
        elif rpname=='125':
            data={'cardno':'1111'}

        elif rpname=='166':
            data={'cardno':'1111'}
        
        elif rpname=='127':
            data={'cardno':'1111'}

        elif rpname=='128':
            data={'cardno':'1111'}
        
        elif rpname=='129':
            data={'cardno':'1111'}

        elif rpname=='130':
            data={'cardno':'1111'}
        
        elif rpname=='131':
            data={'cardno':'1111'}

        elif rpname=='132':
            data={'cardno':'1111'}
        
        elif rpname=='133':
            data={'cardno':'1111'}

        elif rpname=='134':
            data={'cardno':'1111'}
        
        elif rpname=='135':
            data={'cardno':'1111'}

        elif rpname=='136':
            data={'cardno':'1111'}
        
        elif rpname=='137':
            data={'cardno':'1111'}

        elif rpname=='138':
            data={'cardno':'1111'}
        
        elif rpname=='139':
            data={'cardno':'1111'}

        elif rpname=='140':
            data={'cardno':'1111'}
        
        elif rpname=='141':
            data={'cardno':'1111'}

        elif rpname=='142':
            data={'cardno':'1111'}
        
        elif rpname=='143':
            data={'cardno':'1111'}

        elif rpname=='144':
            data={'cardno':'1111'}
        
        elif rpname=='145':
            data={'cardno':'1111'}

        elif rpname=='146': #stock balances
            sql=SubStoreItem.objects.filter(storeId=stid,status='Active').order_by('-itemCode__itemCategory','itemCode__itemName')
            for i in range(len(sql)):
                data.append({
                   'itid':sql[i].itemCode.itemId,
                   'itname':sql[i].itemCode.itemName,
                   'bal':sql[i].itemBalance,
                   'reord':sql[i].reorderLevel,
                   })

        elif rpname=='147':
            data={'cardno':'1111'}

        elif rpname=='148':
            data={'cardno':'1111'}

        elif rpname=='149':
            data={'cardno':'1111'}

        elif rpname=='150':
            data={'cardno':'1111'}

                                     
        return JsonResponse(data,safe=False)