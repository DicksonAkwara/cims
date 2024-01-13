from django.shortcuts import render
from django.http import JsonResponse
from stores.models import *
from MedicalRecords.models import *
import json
from .models import *
from django.contrib.auth.decorators import login_required
from finance.models import PatientBill,cashierReceipt
from systemusers.models import CustomUser
from consultation.models import Prescription
import datetime as ddatetime
from datetime import date,datetime,timedelta




# Create your views here.
@login_required
def phar_index(request):   
    context={}
    return render(request, 'dashboard/pharmacy/phar_index.html',context)
    

@login_required
def phar_reception(request):
     #substores = Store.objects.all()
    substore =Store.objects.filter(category='Sub Store').values('store_name','store_Id')
    patType = PatientType.objects.all()
    context = {
        'substore': substore,
        'patType':patType
    } 
    return render(request, 'dashboard/pharmacy/phar_reception.html', context)

@login_required
def search_prescription(request):
    if request.method=='POST':
        data=[]
        prescno=json.loads(request.body).get('prescno')
        """ vno=json.loads(request.body).get('vno')
        pymode=json.loads(request.body).get('pymode')
        ptype=json.loads(request.body).get('pt') """
        """ sql=''        
        if ptype=='Out-Patient' or ptype=='Walk-In' or ptype=='Day Care':
            sql = Prescription.objects.filter(opNumber=pid,visitOp=vno,status='pending')
        elif ptype=='In-Patient':
            sql = Prescription.objects.filter(opNumber=pid,visitIp=vno,status='pending') """
        
        sql = Prescription.objects.filter(prescription_tag=prescno).order_by('itemCode__itemName')
        if sql:
            for i in range(len(sql)):
                itid=sql[i].itemCode.itemId
                itname=sql[i].itemCode.itemName
                dos=sql[i].dosage
                freq=sql[i].frequency
                dy=sql[i].days
                qt=sql[i].quantity
                st=sql[i].storeId
                prno=sql[i].prescNo
                cpr=0
                bal=0
                pr=SubStoreItem.objects.filter(itemCode=itid,storeId=st)
                for j in range(len(pr)):
                    cpr=pr[j].normalPrice
                    spr=pr[j].specialPrice
                    bal=pr[j].itemBalance
                
                """ if pymode=='cash':
                    cost=cpr
                else:
                    cost=spr """
                
                data.append({
                    'itid':itid,
                    'itname':itname,
                    'dos':dos,
                    'fq':freq,
                    'dy':dy,
                    'qt':qt,
                    'cost':cpr,
                    'bal':bal,
                    'prn':prno
                })
        
        return JsonResponse(data,safe=False)
    
@login_required
def pend_prescription(request):
    if request.method=='POST':
        data=[]
        pcat = json.loads(request.body).get('pcat')
        counter = json.loads(request.body).get('counter')
        startdate = datetime.now()     
        past48hrs = startdate - timedelta(hours=48)
        vno=''
        pmode=''

        sql = Prescription.objects.filter(status='pending',storeId=counter,prescDate__gte=past48hrs).distinct('prescription_tag').order_by('-prescription_tag','-prescDate','-prescTime',)
        if sql:
            for i in range(len(sql)):
                if pcat=='In-Patient':                    
                    vno=sql[i].visitIp.visitId
                    pmode=sql[i].visitIp.subname.scheme_name
                else:
                    vno=sql[i].visitOp.visitNo
                    pmode=sql[i].visitOp.subname.scheme_name
                
                data.append({
                    'pdate':sql[i].prescDate,
                    'ptime':sql[i].prescTime.strftime('%H:%M'),
                    'pno':sql[i].opNumber.op_number,
                    'fname':sql[i].opNumber.fullname,
                    'age':sql[i].opNumber.patient_age,
                    'sex':sql[i].opNumber.gender,
                    'precno':sql[i].prescription_tag,
                    'doc':sql[i].doctor.username,
                    'pmode':pmode,                    
                    'vno':vno
                })
              
        return JsonResponse(data, safe=False)


@login_required
def pendpaidprescription(request):
    if request.method=='POST':
        data=[]
        pcat = json.loads(request.body).get('pcat')
        counter = json.loads(request.body).get('counter')
        startdate = datetime.now()     
        past24hrs = startdate - timedelta(hours=24)
        
        sql = cashierReceipt.objects.filter(receipt_status='pending',trans_date__gte=past24hrs,billReffNo__bill_point='pharmacy',billReffNo__station=counter).distinct('receipt_no').order_by('receipt_no','trans_number',)
        if sql:
            for i in range(len(sql)):
              
                data.append({
                    
                    'pdate':sql[i].trans_date.strftime('%Y-%m-%d(%H:%M)'),
                    'rno':sql[i].receipt_no,
                    'pno':sql[i].pat_card.op_number,
                    'fname':sql[i].pat_card.fullname,
                    'age':sql[i].pat_card.patient_age,
                    'sex':sql[i].pat_card.gender,
                    'doc':sql[i].billReffNo.billed_by.username,                    
                    'vno':sql[i].billReffNo.visitNo.visitNo
                })
                    
        return JsonResponse(data, safe=False)




@login_required
def search_drug(request):
      if request.method == 'POST':
        storeId = json.loads(request.body).get('storeId')
        data=SubStoreItem.objects.filter(storeId=storeId).values('itemCode__itemName')        
        """ if sql:
            for i in range(len(sql)):
                data.append({
                'item_code':sql[i].itemCode.itemId,
                'item_name':sql[i].itemCode.itemName,
                'strength':sql[i].itemCode.strength,
                              
            }) """                     
        return JsonResponse(list(data), safe=False)

"""
'price':sql[i].normalPrice,
'sprice':sql[i].specialPrice,                
'balance':sql[i].itemBalance
"""

@login_required
def loaditemdata(request):
    if request.method == 'POST':
        data=[]
        storeId = json.loads(request.body).get('stid')
        itname = json.loads(request.body).get('itname')
        sql=SubStoreItem.objects.filter(storeId=storeId,itemCode__itemName=itname)
        if sql:
            for i in range(len(sql)):
                data.append({
                'itid':sql[i].itemCode.itemId,
                'price':sql[i].normalPrice,               
                'balance':sql[i].itemBalance                              
            })
        return JsonResponse(data, safe=False)
    


@login_required
def pharmcashBill(request):
    if request.method=='POST':
        data=[]        
        bill=json.loads(request.body)
        msg=''
        prescno=''

        for i in range(len(bill)):
        
            prescno=bill[i]["prescno"]
            pat_type=bill[i]["pty"]
            

            #insert into patient bill
            try:
                cbill=PatientBill()
                cbill.op_number=PatientBioData.objects.get(op_number = bill[i]["pno"])
                cbill.paymode=bill[i]["pym"]
                cbill.patient_type=pat_type
                cbill.bill_point='pharmacy'
                cbill.service=Services.objects.get(service_name=bill[i]["itname"]) 
                cbill.quantity=bill[i]["qnt"]
                cbill.total_price=bill[i]["ttp"]
                cbill.pay_status='billed'
                cbill.visitStatus='open'
                cbill.status='pending'
                cbill.station=Store.objects.get(store_Id=bill[i]["st"])   
                if pat_type=='In-Patient':
                    cbill.visitNoIp=IpVisit.objects.get(visitId=bill[i]["vno"])
                else:
                    cbill.visitNo=OpVisits.objects.get(visitNo=bill[i]["vno"])   
                cbill.billed_by=CustomUser.objects.get(id=request.user.id)
                cbill.save()
                
                rff=cbill.pk

                #insert into pharm_dispense model
                disp=PharmDispense()
                disp.patnumber=PatientBioData.objects.get(op_number = bill[i]["pno"])
                disp.reffno=PatientBill.objects.get(ref_number = rff)
                disp.drug_item=DrugGeneralItem.objects.get(itemId = bill[i]["itcode"])
                disp.store=Store.objects.get(store_Id=bill[i]["st"])
                disp.dosage=bill[i]["dos"]
                disp.frequency=bill[i]["freq"]
                disp.days=bill[i]["dys"]
                disp.quant=bill[i]["qnt"]
                disp.total_price=bill[i]["ttp"]
                disp.status='pending'
                disp.pharmacist=CustomUser.objects.get(id=request.user.id)                          
                disp.save()

                if prescno=='none':
                    pass
                else:
                    presc=Prescription.objects.get(prescNo=prescno)
                    presc.status='received'
                    presc.save()

                msg='bill saved successfully'

            except ValueError as err:
                msg=err
                
        
        data={'msg': msg}                        
        return JsonResponse(data, safe=False)
    

@login_required
def search_receipt(request):
    if request.method=='POST':
        data=[]
        rcpt = json.loads(request.body).get('searchText')        
        pno = json.loads(request.body).get('pno')

        sql = PharmDispense.objects.select_related('drug_item','store').filter(receipt_no=rcpt,patnumber=pno,status='pending')
        if sql:
            itid=0
            stid=0
            bal=0
            for i in range(len(sql)):
                itid=sql[i].drug_item.itemId
                stid=sql[i].store.store_Id
                bal=SubStoreItem.objects.filter(itemCode=itid,storeId=stid).values('itemBalance')

                data.append({
                'rptno':sql[i].receipt_no,
                'dsid':sql[i].disp_id,
                'itemc':itid,
                'itemname':sql[i].drug_item.itemName,
                'dos':sql[i].dosage,                                
                'freq':sql[i].frequency,                                
                'dys':sql[i].days,                                
                'qty':sql[i].quant,                                
                'ttp':sql[i].total_price,              
                'stre':stid,
                'bal':bal[0]['itemBalance'],
                'pbref':sql[i].reffno.ref_number,
            })
                     
        return JsonResponse(data, safe=False)


@login_required
def pharmDispenseScheme(request):
    if request.method=='POST':
        datime=datetime.now()
        data=[]
        bill=json.loads(request.body)        
        msg=''
        
            #get values and insert into patientbill && pharmdispense
        try:
            for i in range(len(bill)):
                patype=bill[i]["ptype"]

                pbill=PatientBill()
                pbill.patient_type=patype
                pbill.op_number=PatientBioData.objects.get(op_number= bill[i]["pno"]) 
                if patype=='In-Patient':
                    pbill.visitNoIp=IpVisit.objects.get(visitId=bill[i]["vno"])
                else:
                    pbill.visitNo=OpVisits.objects.get(visitNo=bill[i]["vno"])
                pbill.paymode=bill[i]["pmode"]
                pbill.bill_point='pharmacy'
                pbill.service=Services.objects.get(service_name=bill[i]["itemname"])
                pbill.urgency='normal'
                pbill.quantity=bill[i]["qnt"]
                pbill.total_price=bill[i]["cost"]
                pbill.pay_status='paid'
                pbill.invoice_status='pending'
                pbill.station=Store.objects.get(store_Id=bill[i]["st"])
                pbill.status='dispensed'
                pbill.done_by=CustomUser.objects.get(id=request.user.id)
                pbill.billed_by=CustomUser.objects.get(id=request.user.id)
                pbill.save()

                pkey=pbill.pk

                disp=PharmDispense()
                disp.patnumber=PatientBioData.objects.get(op_number= bill[i]["pno"]) 
                disp.reffno=PatientBill.objects.get(ref_number=pkey)
                disp.drug_item=DrugGeneralItem.objects.get(itemId= bill[i]["itemid"])
                disp.store=Store.objects.get(store_Id=bill[i]["st"])
                disp.dosage=bill[i]["dos"]
                disp.frequency=bill[i]["frq"]
                disp.days=bill[i]["days"]
                disp.quant=bill[i]["qnt"]
                disp.total_price=bill[i]["cost"]
                disp.status='dispensed'
                disp.DispenseDate=datime
                disp.pharmacist=CustomUser.objects.get(id=request.user.id)
                disp.save()

                #update prescription model
                prno=bill[i]["prescno"]
                if prno=='none':
                    pass
                else:
                    presc=Prescription.objects.get(prescNo=prno)
                    presc.status='received'
                    presc.save()

                #subtracting from stock
                bal=0
                itembal=SubStoreItem.objects.get(itemCode=bill[i]["itemid"],storeId=bill[i]["st"])
                bal=itembal.itemBalance
                
                actbal=float(bal)-float(bill[i]["qnt"])
                if actbal <=0:
                    itembal.itemBalance=0
                else:
                    itembal.itemBalance=actbal

                itembal.save()

                msg='Item(s) dispensed successfully'
        except ValueError as err:
            msg=err
            print(msg) 
        data={'msg':msg}
        return JsonResponse(data, safe=False)
    



@login_required
def pharmDispenseCash(request):
    if request.method=='POST':
        datime=datetime.now()
        data=[]
        bill=json.loads(request.body)        
        msg=''
        
            #get values and insert into patientbill && pharmdispense
        try:
            for i in range(len(bill)):
                pbill=PatientBill.objects.get(ref_number=bill[i]["pbref"])                
                pbill.status='dispensed' 
                pbill.invoice_status='pending'
                pbill.done_by=CustomUser.objects.get(id=request.user.id)
                pbill.save()

                disp=PharmDispense.objects.get(disp_id=bill[i]["dsid"])
                disp.status='dispensed'
                disp.DispenseDate=datime
                disp.pharmacist=CustomUser.objects.get(id=request.user.id)
                disp.save()


                rcptid=[]
                cbill=cashierReceipt.objects.filter(receipt_no=bill[i]["rcptno"])
                for id in range(len(cbill)):
                    rcptid.append(cbill[id].trans_number)


                for tn in range(len(rcptid)):
                    trans=cashierReceipt.objects.get(trans_number=rcptid[tn])    
                    trans.receipt_status='used'
                    trans.save()

                

                #subtracting from stock
                bal=0
                itembal=SubStoreItem.objects.get(itemCode=bill[i]["itemid"],storeId=bill[i]["st"])
                bal=itembal.itemBalance
                
                actbal=float(bal)-float(bill[i]["qnt"])
                if actbal <=0:
                    itembal.itemBalance=0
                else:
                    itembal.itemBalance=actbal

                itembal.save()

                msg='Item(s) dispensed successfully'
        except ValueError as err:
            msg=err 
        data={'msg':msg}
        return JsonResponse(data, safe=False)
    

def dispense_list(request):
    if request.method=='POST':
        data=[]
        stid = json.loads(request.body).get('stid') 
        fdate = ddatetime.datetime.strptime(json.loads(request.body).get('fdate'), '%Y-%m-%d')
        tdate = ddatetime.datetime.strptime(json.loads(request.body).get('tdate'), '%Y-%m-%d')
        todate=tdate + timedelta(hours=23,minutes=59,seconds=59)
        sql=PharmDispense.objects.filter(DispenseDate__range=[fdate,todate],status='dispensed',store__store_Id=stid).order_by('DispenseDate')
        
        if sql:
            for i in range(len(sql)):
                data.append({
                'date':sql[i].trasdate.strftime('%Y-%m-%d(%H:%M)'),
                'pno':sql[i].patnumber.op_number,
                'pname':sql[i].patnumber.fullname,
                'itemname':sql[i].drug_item.itemName,
                'qnt':sql[i].quant,         
                'ttp':sql[i].total_price,              
                'stt':sql[i].status,              
                'dspdate':sql[i].DispenseDate.strftime('%Y-%m-%d(%H:%M)'),              
                'staff':sql[i].pharmacist.username,
            })    
        return JsonResponse(data, safe=False)

def stockbalance(request):
    if request.method=='POST':
        stid = json.loads(request.body).get('stid')
        #result = SubStoreItem.objects.select_related('itemCode','storeId').all().iterator()            
        result = SubStoreItem.objects.select_related('itemCode','storeId').filter(itemCode__gte=0,storeId=stid).order_by('itemCode__itemName')
        data=[]
        for i in range(len(result)):            
            data.append({
                'itcode':result[i].itemCode.itemId,
                'itname':result[i].itemCode.itemName,
                'qnt':result[i].itemBalance,
                'np':result[i].normalPrice,
                'sp':result[i].specialPrice,
                'store':result[i].storeId.store_name,
            })
                          
                      
        return JsonResponse(data, safe=False)
