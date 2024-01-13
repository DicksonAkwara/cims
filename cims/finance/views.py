from django.shortcuts import render
from MedicalRecords.models import *
from .models import *
from .forms import *
import json
from django.http import JsonResponse, HttpResponse
from datetime import date,datetime, timedelta
from django.utils import timezone
from django.contrib.auth.decorators import login_required
from systemusers.models import CustomUser
from sysadmin.models import facility
from pharmacy.models import PharmDispense
from django.db.models import Count, Sum,F
from sysadmin.models import facility
from reports.models import deptReport

from rest_framework import status
@login_required
def financeIndex(request):
    context={}
    return render(request,'dashboard/finance/finance_index.html',context)


@login_required
def cashpoint(request):
    
    patType = PatientType.objects.all()
    facprofile=facility.objects.all()
    
    context={
        'patType':patType, 
        'facility': facprofile      
    }
    return render(request,'dashboard/finance/cashpoint.html',context)

@login_required
def waivers(request):
    patType = PatientType.objects.all()
    context={
        'patType':patType,
    }
    return render(request,'dashboard/finance/waivers.html',context)

@login_required
def patRefund(request):    
    context={}
    return render(request,'dashboard/finance/pat_refunds.html',context)


@login_required
def cancelReceipt(request):    
    context={}
    return render(request,'dashboard/finance/cancel_rcpt.html',context)

@login_required
def billAdj(request):
    patType = PatientType.objects.all()
    context={
        'patType':patType,
    }
    return render(request,'dashboard/finance/bill_adj.html',context)


@login_required
def patInvoice(request):
    patType = PatientType.objects.all() 
    schemes= Schemes.objects.all()   
    context={
        'patType':patType,
        'scheme':schemes,
    }
    return render(request,'dashboard/finance/pat_invoice.html',context)

@login_required
def billing(request):
    patType = PatientType.objects.all()
    hosp = facility.objects.all()
    context={
        'patType':patType,
        'facility':hosp,
    }
    return render(request,'dashboard/finance/billing.html',context)


@login_required
def cpSearchService(request):
    if request.method == 'POST':        
        search_str = json.loads(request.body).get('searchText')       
        svs = list(Services.objects.filter(service_name__icontains=search_str,service_type='service')[0:5].values())
        return JsonResponse(svs, safe=False)


@login_required
def reg_scheme(request):
    scheme = Schemes.objects.all()
    if request.method=='POST':
        form = schemeForm(request.POST)
        
    else:
        form=schemeForm()
    context={
        'scheme':scheme,
        'form':form,
    }   
    return render(request, 'dashboard/finance/reg_scheme.html', context)

############################## individual methods ##################################

@login_required
def retrieveBill(request):
    if request.method == 'POST':   
        startdate = datetime.now()     
        enddate = startdate - timedelta(hours=24)
        data=[]
        search_str = json.loads(request.body).get('pid')
        pType = json.loads(request.body).get('ptype')
        vno = json.loads(request.body).get('vno')
        wvid='none' 
        if pType=='In-Patient':
            sql=PatientBill.objects.filter(op_number=search_str,visitNoIp=vno,pay_status='billed').order_by('service__service_point')               
            #also search for waivers and adjustments            
            data=[]
            storeid=0
            
            wvamt=0         
            for i in range(len(sql)):
                reff_no=sql[i].ref_number
                dept=sql[i].bill_point
                if dept=='pharmacy':
                    storeid=sql[i].station.store_Id

                wvamout=waiver.objects.filter(billReffNo=reff_no,waiver_status='pending')
                for j in range(len(wvamout)):
                    wvamt=wvamout[j].waiver_amount
                    wvid=wvamout[j].waiverNo

                data.append({                
                    'scode':sql[i].service.scode,
                    'sname':sql[i].service.service_name,
                    'qnt':sql[i].quantity,
                    'nprice':sql[i].service.normal_rate,
                    'tprice':sql[i].total_price,
                    'spoint':sql[i].bill_point,
                    'reff_no':sql[i].ref_number,
                    'wvamount':wvamt,
                    'wvid':wvid, 
                    'store':storeid,                  
                })

        elif pType=='Walk-In':
            sql=PatientBill.objects.filter(wlknumber=search_str,bill_date__gte=enddate,pay_status='billed').order_by('service__service_point')
            #also search for waivers and adjustments           
            wvamt=0                   
            for i in range(len(sql)):
                reff_no=sql[i].ref_number
                wvamout=waiver.objects.filter(billReffNo=reff_no,waiver_status='pending')
                for j in range(len(wvamout)):
                    wvamt=wvamout[j].waiver_amount
                    wvid=wvamout[j].waiverNo     
                    for i in range(len(sql)):
                        data.append({                
                            'scode':sql[i].service.scode,
                            'sname':sql[i].service.service_name,
                            'qnt':sql[i].quantity,
                            'nprice':sql[i].service.normal_rate,
                            'tprice':sql[i].total_price,
                            'spoint':sql[i].bill_point,
                            'reff_no':sql[i].ref_number,
                            'wvamount':wvamt,
                            'wvid':wvid, 
                            'store':sql[i].station,                   
                        }) 
            
        else:
            sql=PatientBill.objects.filter(op_number=search_str,bill_date__gte=enddate,pay_status='billed').order_by('service__service_point')
                
            #also search for waivers and adjustments  
            storeid=0         
            wvamt=0                   
            for i in range(len(sql)):
                reff_no=sql[i].ref_number
                dept=sql[i].bill_point
                if dept=='pharmacy':
                    storeid=sql[i].station.store_Id

                wvamout=waiver.objects.filter(billReffNo=reff_no,waiver_status='pending')
                for j in range(len(wvamout)):
                    wvamt=wvamout[j].waiver_amount
                    wvid=wvamout[j].waiverNo

                data.append({                
                    'scode':sql[i].service.scode,
                    'sname':sql[i].service.service_name,
                    'qnt':sql[i].quantity,
                    'nprice':sql[i].service.normal_rate,
                    'tprice':sql[i].total_price,
                    'spoint':sql[i].bill_point,
                    'reff_no':sql[i].ref_number,
                    'wvamount':wvamt,                   
                    'wvid':wvid, 
                    'store':storeid,                   
                })

        return JsonResponse(data, safe=False)


def checkshift(request):
    if request.method=='POST':
        data=[]
        today=datetime.now()        
        chk=cashierShift.objects.filter(cashier=request.user.id,start_date__gte=today,shift_status='open')
        if chk:
            for i in range(len(chk)):                
                    data.append({
                    'shiftno':chk[i].shiftNo,                    
                    })
        else:
            shift=cashierShift()
            shift.start_date=today
            shift.shift_status='open'
            shift.cashier=CustomUser.objects.get(id=request.user.id)
            shift.save()

            data.append({
                'shiftno':shift.pk,
                })
        return JsonResponse(data, safe=False)


def save_transaction(request):
    if request.method=='POST':
        data=[]
        reffno=[]
        waiverid=[]
        bill=json.loads(request.body)
        now=datetime.now().timestamp()
        now_x=hex(int(now))
        hexa_now=now_x[2:] #removing the first two characters        
        rfno=0
        transtype=''
        pat_no=''
        tot_price=''
        try:
            for i in range(len(bill)):
                rfno=bill[i]["rfno"]
                dpt=bill[i]["dpt"]
                transtype=bill[i]["ttype"]
                pat_no=bill[i]["pno"] 
                tot_price=bill[i]["ttp"]

                waiverid.append(bill[i]["wvid"])

                if rfno=='none':
                    cbill=PatientBill()
                    cbill.op_number=PatientBioData.objects.get(op_number = bill[i]["pno"])
                    cbill.paymode='cash'
                    cbill.patient_type=bill[i]["pty"]
                    cbill.bill_point=bill[i]["dpt"]
                    cbill.service=Services.objects.get(scode = bill[i]["scode"])
                    cbill.quantity=bill[i]["qnt"]
                    cbill.total_price=bill[i]["ttp"]
                    cbill.pay_status='pending'
                    cbill.visitStatus='open'
                    cbill.status='pending'
                    cbill.visitNo=OpVisits.objects.get(visitNo=bill[i]["vno"])   
                    cbill.billed_by=CustomUser.objects.get(id=request.user.id)
                    cbill.save()
                    rff=cbill.pk
                    reffno.append(rff)
                    rfno=rff

                else:
                    reffno.append(rfno)
                
                cash=cashierReceipt()
                cash.shift_number=cashierShift.objects.get(shiftNo=bill[i]["sft"])
                cash.billReffNo=PatientBill.objects.get(ref_number=rfno)
                cash.pat_card=PatientBioData.objects.get(op_number=bill[i]["pno"])
                cash.paymode=bill[i]["pym"]
                cash.mobile_no=bill[i]["mn"]
                cash.mobile_trans_no=bill[i]["mtn"]
                cash.receipt_no=hexa_now
                cash.receipt_status='pending'
                cash.trans_type=transtype
                cash.paid_amount=float(bill[i]["ttp"])-float(bill[i]["wv"])
                cash.cashier=CustomUser.objects.get(id=request.user.id)
                cash.save()

                if(dpt=='pharmacy'):
                    #itemcode=Services.objects.get(scode=bill[i]["scode"]).item_id.itemId
                    phm=PharmDispense.objects.get(reffno=rfno)
                    phm.status='pending'
                    phm.receipt_no=hexa_now                                     
                    phm.save()

                
            
                
            for reff in reffno:
                billInfo = PatientBill.objects.get(ref_number=reff)
                billInfo.pay_status='paid'
                billInfo.save()


            for reff in waiverid:
                if(reff=='none'):
                    pass
                else:
                    wvr = waiver.objects.get(waiverNo=reff)
                    if wvr:
                        wvr.waiver_status='receipted'
                        wvr.transaction_type='waiver'
                        wvr.cashier=CustomUser.objects.get(id=request.user.id)
                        wvr.receipt_no=hexa_now
                        wvr.save()        
                
            if transtype=='exception':            
                expt = waiver()
                expt.billReffNo= PatientBill.objects.get(ref_number=reff)
                expt.pat_card=PatientBioData.objects.get(op_number=pat_no)
                expt.waiver_amount=tot_price
                expt.waived_by=CustomUser.objects.get(id=request.user.id)
                expt.cashier=CustomUser.objects.get(id=request.user.id)
                expt.waiver_status='receipted'
                expt.transaction_type='exception'
                expt.receipt_no=hexa_now 
                expt.save()

        except ValueError as err:
            print(err)
            data={'msg':err}           
            

        transdate=datetime.now()
        data={
            'msg': 'receipt saved successfully',
            'rcptno':hexa_now,
            'date':transdate.strftime("%d-%m-%y,%I:%M%p")
            }
                
        return JsonResponse(data, safe=False)



def save_walkin(request):
    if request.method=='POST':
        data=[]
        bill=json.loads(request.body)
        now=datetime.now().timestamp()
        now_x=hex(int(now))
        hexa_now=now_x[2:] #removing the first two characters        
        rfno=0
        transtype=''
        try:
            for i in range(len(bill)):
                transtype=bill[i]["ttype"]
                pdetails=bill[i]["pdetails"]

                cbill=PatientBill()
                #cbill.op_number=PatientBioData.objects.get(op_number = bill[i]["pno"])
                cbill.wlknumber=pdetails
                cbill.paymode='cash'
                cbill.patient_type=bill[i]["pty"]
                cbill.bill_point=bill[i]["dpt"]
                cbill.service=Services.objects.get(scode = bill[i]["scode"])
                cbill.quantity=bill[i]["qnt"]
                cbill.total_price=bill[i]["ttp"]
                cbill.pay_status='paid'
                cbill.status='dispensed'
                cbill.billed_by=CustomUser.objects.get(id=request.user.id)
                cbill.save()
                rfno=cbill.pk

                
                cash=cashierReceipt()
                cash.shift_number=cashierShift.objects.get(shiftNo=bill[i]["sft"])
                cash.billReffNo=PatientBill.objects.get(ref_number=rfno)
                #cash.pat_card=PatientBioData.objects.get(op_number=bill[i]["pno"])
                cash.paymode='cash'
                cash.mobile_no=bill[i]["mn"]
                cash.mobile_trans_no=bill[i]["mtn"]
                cash.receipt_no=hexa_now
                cash.receipt_status='used'
                cash.trans_type=transtype
                cash.paid_amount=float(bill[i]["ttp"])
                cash.cashier=CustomUser.objects.get(id=request.user.id)
                cash.save()

            transdate=datetime.now()
            data={
            'msg': 'receipt saved successfully',
            'rcptno':hexa_now,
            'date':transdate.strftime("%d-%m-%y,%I:%M%p")
            }
        except ValueError as err:
            print(err)
            data={'msg':err}
        print(data)
        return JsonResponse(data, safe=False)
    
#invoices finalization

@login_required
def schemebill(request):
    if request.method=='POST':
        data=[]
        fdate=json.loads(request.body).get('fdate')
        scname=json.loads(request.body).get('scname')
        sql=PatientBill.objects.filter(bill_date__gte=fdate,pay_status='paid',invoice_status='pending',paymode=scname).distinct('op_number')
        if sql:
            for i in range(len(sql)):
                data.append({
                    'rfno':sql[i].ref_number,
                    'sdate':sql[i].bill_date.strftime("%Y-%m-%d(%I:%M%p)"),
                    'pid':sql[i].op_number.op_number,
                    'pname':sql[i].op_number.fullname,
                    'scname':sql[i].paymode,
                })
        return JsonResponse(data, safe=False)
    
@login_required
def patientSchemeBill(request):
    if request.method=='POST':
        data=[]
        fdate=json.loads(request.body).get('bdate')
        scname=json.loads(request.body).get('scname')
        pno=json.loads(request.body).get('pno')
        sql=PatientBill.objects.filter(bill_date__gte=fdate,pay_status='paid',invoice_status='pending',paymode=scname,op_number=pno).order_by('-bill_date')
        if sql:
            for i in range(len(sql)):
                data.append({
                    'refno':sql[i].ref_number,
                    'sdate':sql[i].bill_date.strftime("%Y-%m-%d(%I:%M%p)"),
                    'service':sql[i].service.service_name,
                    'qnt':sql[i].quantity,
                    'price':sql[i].service.scheme_rate,
                    'tprice':sql[i].total_price,
                })

        return JsonResponse(data, safe=False)

@login_required   
def finalizePatBill(request):
    if request.method=='POST':
        rfno=json.loads(request.body)

        now=datetime.now().timestamp()
        now_x=hex(int(now))
        hexa_now=now_x[2:] #removing the first two characters

        for i in range(len(rfno)):
           refn=rfno[i]["rfn"]
           inv='inv'+str(hexa_now)

           sql=PatientBill.objects.get(ref_number=refn)
           sql.invoice_by=CustomUser.objects.get(id=request.user.id)
           sql.invoice_status='finalized'
           sql.visitStatus='closed'
           sql.invoice_number=inv
           sql.invoice_date=datetime.now()
           sql.save()
        data={'msg':f'finalized successful invoice number: '+inv}
        return JsonResponse(data, safe=False)
    
@login_required
def finalinvlist(request):
    if request.method=='POST':
        data=[]
        fdate=json.loads(request.body).get('fdate')
        scname=json.loads(request.body).get('scname')
        ptype=json.loads(request.body).get('ptype')
        sql=PatientBill.objects.filter(bill_date__gte=fdate,invoice_status='finalized',paymode=scname,patient_type=ptype).distinct('invoice_number')
        if sql:
            for i in range(len(sql)):
                data.append({
                    'sdate':sql[i].invoice_date.strftime("%Y-%m-%d"),                    
                    'pid':sql[i].op_number.op_number,
                    'nid':sql[i].op_number.national_idno,
                    'invno':sql[i].invoice_number,
                    'pname':sql[i].op_number.fullname,
                    'scname':sql[i].paymode,
                })
        return JsonResponse(data, safe=False)
    

@login_required
def patFinalInv(request):
    if request.method=='POST':
        data=[]
        fndata=[]
        prdata=[]
        invno=json.loads(request.body).get('invno')
        sql=PatientBill.objects.filter(invoice_number=invno).order_by('-invoice_date')
        ttsum=PatientBill.objects.filter(invoice_number=invno).aggregate(Sum('total_price'))['total_price__sum']
        hosprof=facility.objects.all()            
        if sql:
            for i in range(len(sql)):
                fndata.append({
                    'sdate':sql[i].bill_date.strftime("%Y-%m-%d(%I:%M%p)"),
                    'bdate':sql[i].bill_date.strftime("%d-%m-%Y"),
                    'service':sql[i].service.service_name,
                    'qnt':sql[i].quantity,
                    'price':sql[i].service.scheme_rate,
                    'tprice':sql[i].total_price,
                    'billby':sql[i].billed_by.username,
                    'invby':sql[i].invoice_by.fullname,
                })
        
        if hosprof:
            for i in range(len(hosprof)):
                prdata.append({
                    'fname':hosprof[i].facName,
                    'abbr':hosprof[i].facAbbreviation,
                    'location':hosprof[i].location,
                    'phone':hosprof[i].phoneNo,
                    'email':hosprof[i].email,
                    'footer':hosprof[i].stmtFooter,
                    'user':request.user.fullname
                })

        
        data={"fndata":fndata,'ttsum':ttsum,'profile':prdata}
        return JsonResponse(data, safe=False)
    

@login_required
def financereport(request):
    finreport=deptReport.objects.filter(departmentName='4').order_by('reportName')
    context={
        'reports':finreport
    }
    if request.method=='GET':
        return render(request,'dashboard/finance/fin_reports.html',context)
    
    elif request.method=='POST':
        data=[]
        return JsonResponse(data, safe=False)
    

@login_required
def reprintReceipt(request):    
    if request.method=='GET':
        return render(request,'dashboard/finance/reprint_receipt.html')
    
    elif request.method=='POST':
        data=[]
        return JsonResponse(data, safe=False)


@login_required   
def unfinalizeBill(request):
    if request.method=='POST':
        invno=json.loads(request.body).get('invno')        
        sql=PatientBill.objects.filter(invoice_number=invno)
        invn=[]
        for i in range(len(sql)):
            invn.append(sql[i].ref_number)
        
        for j in range(len(invn)):
            fn=PatientBill.objects.get(ref_number=invn[j])
            fn.invoice_status='pending'
            fn.visitStatus='open'
            fn.invoice_number=''
            fn.save()
        data={'msg':f' invoice number: '+invno+' reset successfully'}
        return JsonResponse(data, safe=False)
    

def removebill(request):
    if request.method=='POST':
        data=[]
        ref=json.loads(request.body).get('refno')
        fn=PatientBill.objects.get(ref_number=ref)
        fn.invoice_status='cancelled'
        fn.visitStatus='closed'
        fn.invoice_number=''
        fn.save()
        data={'msg':f' Service/Item with ref number: '+ref+' deleted successfully'}         
        return JsonResponse(data, safe=False)
    

def loadbill(request):
    if request.method=='POST':
        data=[]
        pno=json.loads(request.body).get('pno')
        vno=json.loads(request.body).get('vno')
        ptype=json.loads(request.body).get('ptype')
        sql=''
        ttsum=0.0
        ttdep=0.0
        if ptype=='In-Patient':
            #sql=PatientBill.objects.filter(op_number=pno,visitNoIp=vno,visitStatus='open',pay_status='billed').order_by('service__service_point')
            sql=PatientBill.objects.filter(op_number=pno,visitNoIp=vno,visitStatus='open').order_by('service__service_point')
            ##paid amount
            ttsum=PatientBill.objects.filter(op_number=pno,visitNoIp=vno,visitStatus='open',pay_status='paid').aggregate(Sum('total_price'))['total_price__sum']
            ##paid deposits
            deposits=cashDeposit.objects.filter(pat_card=pno,visitNoIp=vno).aggregate(Sum('depositAmount'))['depositAmount__sum']
            if ttsum==None:
                ttsum=0
            
            if deposits==None:
                ttdep=0

        else:
            sql=PatientBill.objects.filter(op_number=pno,visitNo=vno,visitStatus='open',pay_status='billed').order_by('service__service_point')

        
        if sql:            
            for i in range(len(sql)):
                data.append({
                    'bdate':sql[i].bill_date.strftime("%Y-%m-%d"),                   
                    'reffno':sql[i].ref_number,
                    'service':sql[i].service.service_name,
                    'dept':sql[i].service.service_point,
                    'qnty':sql[i].quantity,
                    'status':sql[i].pay_status,
                    'cost':sql[i].total_price,
                    'staff':sql[i].billed_by.username,                    
                    'ttsum':float(ttsum),
                    'ttdep':float(ttdep),
                })
        return JsonResponse(data, safe=False)

def savewaivernotes(request):
    if request.method=='POST':
        data=[]
        bill=json.loads(request.body)
        notesid=0
        for i in range(len(bill)):## run only once to get the notes
            wvnotes=waiverNotes()
            wvnotes.notes=bill[i]["notes"]
            wvnotes.patient_no=PatientBioData.objects.get(op_number = bill[i]["pno"])
            wvnotes.notes_by=CustomUser.objects.get(id=request.user.id)
            wvnotes.save()
            notesid=wvnotes.pk        
        return JsonResponse({'msg':'success','noteid':notesid},status=status.HTTP_200_OK)
        
    

def save_waiver(request):
    if request.method=='POST':
        data=[]
        ptype=''
        bill=json.loads(request.body)
        for i in range(len(bill)):
            waive=waiver()
            waive.billReffNo=PatientBill.objects.get(ref_number=bill[i]["rfno"])
            waive.pat_card=PatientBioData.objects.get(op_number = bill[i]["pno"])
            waive.waiver_amount=bill[i]["wvamount"]
            if ptype=='In-Patient':
                waive.vno_ip=IpVisit.objects.get(visitId=bill[i]["vno"])
            else:
                waive.vno_op=OpVisits.objects.get(visitNo=bill[i]["vno"])

            waive.waived_by=CustomUser.objects.get(id=request.user.id) 
            waive.waiver_status='pending'
            waive.transaction_type='waiver'
            waive.notesid=waiverNotes.objects.get(id=bill[i]["nid"])
            waive.save()

        data={
            'msg': 'saved'
            }

        return JsonResponse(data, safe=False)
    


def receipt_search(request):
    if request.method=='POST':
        data=[]
        rno=json.loads(request.body).get('rnumber')
        sql=cashierReceipt.objects.filter(receipt_no=rno).order_by('billReffNo__service__service_name')
        rtotal=cashierReceipt.objects.filter(receipt_no=rno).aggregate(Sum('paid_amount'))['paid_amount__sum']
        if sql:
            for i in range(len(sql)):                
                data.append({
                    'billref':sql[i].billReffNo.ref_number,
                    'rctno':sql[i].receipt_no,
                    'service':sql[i].billReffNo.service.service_name,
                    'qnty':sql[i].billReffNo.quantity,
                    'tprice':sql[i].paid_amount,
                    'pname':sql[i].pat_card.fullname,
                    'rcby':sql[i].cashier.username,
                    'dtime':sql[i].trans_date.strftime("%Y-%m-%d(%I:%M%p)"),
                    'rtotal':rtotal
                })

        return JsonResponse(data,safe=False)

@login_required
def cancel_receipt(request):
    if request.method=='POST':
        data=[]
        rno=json.loads(request.body).get('rcpt')
        notes=json.loads(request.body).get('notes')
        cashierReceipt.objects.filter(receipt_no=rno).update(receipt_status='cancelled')

        reas=receipt_cancel()
        reas.receipt_no=notes
        reas.receipt_no=rno
        reas.cancelled_by=CustomUser.objects.get(id=request.user.id)
        reas.save()
        data.append({
            'msg':'success'
        })

        return JsonResponse(data, safe=False)

@login_required    
def save_adjustment(request):
    if request.method=='POST':
        try:
            msg=''
            pb=json.loads(request.body)
            #pb=bill["bill"] #it is the only main item in the dictionary 
            print(pb) 

            for i in range(len(pb)):
                billInfo = PatientBill()
                pym=pb[i]["pym"]
                billInfo.op_number=PatientBioData.objects.get(op_number = pb[i]["patno"])
                billInfo.paymode=pym
                billInfo.patient_type=pb[i]["ptype"]
                billInfo.bill_point=pb[i]["dpt"]
                billInfo.service=Services.objects.get(service_name = pb[i]["svsname"])
                billInfo.quantity=pb[i]["sub_qnt"]
                billInfo.total_price=pb[i]["sub_amt"]
                if pym=='cash':
                    billInfo.pay_status='billed'
                else:
                    billInfo.pay_status='paid'
                    billInfo.invoice_status='pending'
                billInfo.visitStatus='open'
                billInfo.status='pending'  
                if pb[i]['ptype']=='In-Patient':
                    billInfo.visitNoIp=IpVisit.objects.get(visitId=pb[i]["visitno"])
                    billInfo.pay_status='billed'
                else:    
                    billInfo.visitNo=OpVisits.objects.get(visitNo=pb[i]["visitno"])
                billInfo.billed_by=CustomUser.objects.get(id=request.user.id)
                if billInfo.save():
                    return JsonResponse({"msg":"success"})
        except requests.exceptions.RequestException as e:
            return JsonResponse({"msg":"error"})
        

#preauth
@login_required
def preath_invoice(request):
    if request.method=='POST':
        bill=json.loads(request.body)
        pb=bill["bill"]
        data=[]
        try:     
            for i in range(len(pb)):
                billInfo = preauth_form()
                billInfo.pat_card=PatientBioData.objects.get(op_number = pb[i]["op_no"])
                billInfo.scheme=Schemes.objects.get(sub_name=pb[i]["pym"])
                billInfo.patientType=PatientType.objects.get(category=pb[i]["ptype"])
                billInfo.service=Services.objects.get(scode = pb[i]["code"])
                billInfo.quant=pb[i]["qnty"]
                billInfo.totalprice=pb[i]["cost"]
                billInfo.preauth_status='preauth'  
                if pb[i]['ptype']=='In-Patient':
                    billInfo.visitNoIp=IpVisit.objects.get(visitId=pb[i]["vno"])
                else:    
                    billInfo.visitNoOp=OpVisits.objects.get(visitNo=pb[i]["vno"])
                billInfo.raised_by=CustomUser.objects.get(id=request.user.id)
                billInfo.save()
                

            return JsonResponse({'msg':'success'})
        except requests.exceptions.RequestException as e:
            return JsonResponse({"Error":str(e)})
        #return JsonResponse(data,safe=False)


        
##icdapi

import requests

def fetch_icd11_dataset():
    api_url = "http://localhost:6382/icd/release/11/v2/mms/dataset"  # Replace "your_release_name" with the actual release name.

    try:
        response = requests.get(api_url)

        if response.status_code == 200:
            data = response.json()
            return data  # Return the entire ICD-11 dataset.
        else:
            # Handle API error responses here.
            return None

    except requests.exceptions.RequestException as e:
        # Handle connection or request errors here.
        print(f"Error: {e}")
        return None
    


##########################################################

from django.shortcuts import render
from requests.auth import HTTPBasicAuth
import requests
from django.http import JsonResponse

from datetime import datetime
import json
import base64

#from core.settings import env
import environ

env = environ.Env()
environ.Env.read_env()

# Create your views here.

def get_token(request):
    consumer_key=env("CONSUMER_KEY")
    consumer_secret=env("CONSUMER_SECRET")
    access_token_url=env("ACCESS_TOKEN_URL")
    headers={'Content-Type':'application/json'}
    auth=HTTPBasicAuth(consumer_key,consumer_secret)
    try:
        response=requests.get(access_token_url,headers=headers,auth=auth)
        response.raise_for_status()
        result=response.json()
        access_token=result['access_token']
        return JsonResponse({'access_token':access_token})
    except requests.exceptions.RequestException as e:
        return JsonResponse({'error':str(e)})

def initiate_push(request):
    if request.method=='POST':
        access_token_response=get_token(request)
        if isinstance(access_token_response,JsonResponse):
            access_token_utf=access_token_response.content.decode("utf-8")
            access_token=json.loads(access_token_utf).get('access_token')
            if access_token:
                amount=json.loads(request.body).get('amount')
                phone=json.loads(request.body).get('phonenumber')

                passkey=env("PASS_KEY")
                business_short_code=env("BUSINESS_SHORTCODE")
                url=env("PROCESS_URL")
                call_back_url=env("CALLBACKURL")
                timestamp=datetime.now().strftime("%Y%m%d%H%M%S")
                
                password_str = business_short_code + passkey + timestamp
                password_bytes= password_str.encode()
                password=base64.b64encode(password_bytes).decode()

                account_reference="Tibasoft bill"
                transaction_desc="test bill"
                headers = {
                    "Authorization": "Bearer "+access_token,
                    "Content-Type": "application/json",
                }

                payload = {
                    "BusinessShortCode": business_short_code,
                    "Password": password,
                    "Timestamp": timestamp,
                    "TransactionType": "CustomerPayBillOnline",
                    "Amount": amount,
                    "PartyA": phone,
                    "PartyB":business_short_code,
                    "PhoneNumber": phone,
                    "CallBackURL":call_back_url,
                    "AccountReference": account_reference,
                    "TransactionDesc": transaction_desc
                }

                try:
                    response = requests.post(url, headers=headers, json=payload)
                    response.raise_for_status()
                    response_data=response.json()
                    checkout_request_id=response_data['CheckoutRequestID']
                    response_code=response_data['ResponseCode']
                    if response_code=="0":
                        return JsonResponse({"CheckoutID":checkout_request_id})
                    else:
                        return JsonResponse({"error":"stk push failed"})
                except requests.exceptions.RequestException as e:
                    return JsonResponse({"Error":str(e)})
            else:
                return JsonResponse({"error":"Access token not found"})
        else:
            return JsonResponse({"error":"failed to retrieve access token"})


def callback(request):


    """ {"Body":
     {"stkCallback":
      {"MerchantRequestID":"78754-72716214-1","CheckoutRequestID":"ws_CO_03112023191535369729993680","ResultCode":0,"ResultDesc":"The service request is processed successfully.",
       "CallbackMetadata":
       {"Item":[
        {"Name":"Amount","Value":1.00},
        {"Name":"MpesaReceiptNumber","Value":"RK37CF5FXH"},
        {"Name":"Balance"},
        {"Name":"TransactionDate","Value":20231103191251},
        {"Name":"PhoneNumber","Value":254729993680}
        ]}
        }}} """
    stk_callback_response=json.loads(request.body)
    log_file="Mpesastkresponse.json"
    with open(log_file, "a") as log:
        json.dump(stk_callback_response, log)
    
    merchant_request_id=stk_callback_response['Body']['stkCallback']['MerchantRequestID']
    CheckoutRequestID=stk_callback_response['Body']['stkCallback']['CheckoutRequestID']
    ResultCode=stk_callback_response['Body']['stkCallback']['ResultCode']
    ResultDesc=stk_callback_response['Body']['stkCallback']['ResultDesc']
    amount=stk_callback_response['Body']['stkCallback']['CallbackMetadata']['item'][0]['Value']
    trans_id=stk_callback_response['Body']['stkCallback']['CallbackMetadata']['item'][1]['Value']
    trans_date=stk_callback_response['Body']['stkCallback']['CallbackMetadata']['item'][3]['Value']
    phone_no=stk_callback_response['Body']['stkCallback']['CallbackMetadata']['item'][4]['Value']

    if ResultCode ==0:
        #store data into table
        pass
    elif ResultCode==1:
    #"ResultDesc":"The balance is insufficient for the transaction."
        pass
    elif ResultCode==1032:
    #ResultDesc":"Request cancelled by user"
        pass




#################################pdf trial##########################################
from reportlab.pdfgen import canvas   
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.lib import colors
from django.templatetags.static import static

def genreportlab(request):
    filename='mydoc.pdf'
    docname='Document name'
    title='Document header title'
    docsubtitle='This is the document subtitle'
    textlines=['Now that you know the basics of stashing, there is one caveat with git stash',
               'changes that have been added to your index (staged changes)',
               'changes made to files that are currently tracked by Git (unstaged changes)',
               'new files in your working copy that have not yet been staged']
    

    image=static('images/hr.png')

    pdf=canvas.Canvas(filename)
    pdf.setTitle(docname)

    pdf.setFont('Courier-Bold',15)
    pdf.setFillColorRGB(0,0,255)
    pdf.drawCentredString(300,770,title)

    pdf.setFont('Courier',13)
    pdf.drawCentredString(270,750,docsubtitle)

    pdf.line(30,740,550,740)##horizontal line

    text=pdf.beginText(40,680)
    text.setFont('Courier',12)
    text.setFillColor(colors.black)
    for line in textlines:
        text.textLine(line)

    pdf.drawText(text)   

    pdf.drawInlineImage(image,130,400) 
    pdf.save()
    return JsonResponse({'data':'data'}, safe=False)
    #context={}
    #return render(request,'dashboard/finance/pdf.html',context)


from io import BytesIO
from django.template.loader import get_template
from xhtml2pdf import pisa

def htmltopdf(template_src,context_dict={}):
    template=get_template(template_src)
    html=template.render(context_dict)
    result=BytesIO()
    pdf=pisa.pisaDocument(BytesIO(html.encode("ISO-8859-1")),result)
    if not pdf.err:
        return HttpResponse(result.getvalue(), content_type='application/pdf')

    return None

data={}
def viewpdf(request):
    pdf=htmltopdf('dashboard/finance/pdf.html',data)
    return HttpResponse(pdf,content_type='application/pdf')

def downloadpdf(request):
    pdf=htmltopdf('dashboard/finance/pdf.html',data)
    response=HttpResponse(pdf,content_type='application/pdf')
    filename="invoice_%s.pdf"%(12345)
    content="attachment; filename='%s'"%(filename)
    response['content-Disposition']=content
    return response

