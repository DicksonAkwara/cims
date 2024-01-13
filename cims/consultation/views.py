from queue import Empty
from django.shortcuts import render
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta
from django.http import JsonResponse
from MedicalRecords.models import *
from nursing.models import *
from laboratory.models import *
from finance.models import *
from stores.models import *
from .models import *
import json
from systemusers.models import CustomUser 
from django.contrib.auth.decorators import login_required
# Create your views here.
from pharmacy.models import PharmDispense
from sysadmin.models import facility

@login_required
def cons_index(request):
    context={}
    
    return render(request, 'dashboard/consult/cons_index.html',context)

@login_required
def consult_report(request):
    context={}    
    return render(request, 'dashboard/consult/consult_report.html',context)

@login_required
def general_cons(request):
    patType = PatientType.objects.all()
    wards = IpWard.objects.all()
    clinics = OpClinics.objects.filter(clinic_type='General').order_by('clinic_name')
    spclinics = OpClinics.objects.filter(clinic_type='Special').order_by('clinic_name')
    stores = Store.objects.filter(category='Sub Store')
    tb = TbIndicators.objects.all().order_by('indicator')
    profile = facility.objects.all()
    context = {       
        'patType':patType,
        'wards':wards,
        'clinics':clinics,
        'spclinics':spclinics,
        'stores':stores,
        'tb':tb,
        'profile':profile
    } 
    
    
    return render(request, 'dashboard/consult/general_cons.html',context)

@login_required
def cons_pat_search(request):
    if request.method == 'POST':
        """ startdate = date.today()
        enddate = startdate - timedelta(days=1) """
        startdate = datetime.now()     
        enddate = startdate - timedelta(hours=24)
        search_str = json.loads(request.body).get('searchText')
        ptype = json.loads(request.body).get('ptype')
        flist=[]
        if ptype=='In-Patient':
            patient =IpVisit.objects.filter(ipNumber=search_str,admStatus='active')
             
            if patient:            
                        
                for i in range(len(patient)):                
                    flist.append({
                    'scheme_name':patient[i].subname.sub_name,
                    'scheme_type':patient[i].subname.scheme_name,
                    'pid':patient[i].ipNumber.op_number,
                    'fname':patient[i].ipNumber.fullname,
                    'age':patient[i].ipNumber.patient_age,
                    'gender':patient[i].ipNumber.gender,             
                    'phone':patient[i].ipNumber.patient_phone,             
                    'vno':patient[i].visitId,
                    'pcat':patient[i].patientCategory,
                    'wdname':patient[i].wardName.wardName,           
                    'dateadm':patient[i].admissionDate, 
                    'nokname':patient[i].ipNumber.nok_name, 
                    'nokphone':patient[i].ipNumber.nok_phone, 
                    'nokrel':patient[i].ipNumber.nok_relation, 
                })      
        else:
            patient =OpVisits.objects.select_related('op_number','subname','clinic_name').filter(op_number=search_str,visit_date__gte=enddate)
            if patient:            
                #ldate=list(OpVisits.objects.filter(op_number=search_str).order_by('-visit_date').values('visit_date')) 
                
                for i in range(len(patient)):                
                    flist.append({
                    'scheme_name':patient[i].subname.sub_name,
                    'scheme_type':patient[i].subname.scheme_name,
                    'pid':patient[i].op_number.op_number,
                    'fname':patient[i].op_number.fullname,
                    'age':patient[i].op_number.patient_age,
                    'gender':patient[i].op_number.gender,             
                    'phone':patient[i].op_number.patient_phone,             
                    'vno':patient[i].visitNo,
                    'invno':patient[i].invoice_no,
                    'clname':patient[i].clinic_name.clinic_name,
                    'urg':patient[i].urgency,                             
                    'pcat':patient[i].category.categoryName,                             
                })      
        
        return JsonResponse(flist, safe=False)

@login_required

def search_walkin(request):
    if request.method=='POST':
        startdate = datetime.now()     
        enddate = startdate - timedelta(hours=24)
        search_str = json.loads(request.body).get('searchText')
        flist=[]
        patient =wlkpatient.objects.filter(wlkno=search_str,date_created__gte=enddate)    
        flist=[]
        if patient:
            for i in range(len(patient)):                
                flist.append({
                'pid':patient[i].wlkno,
                'fname':patient[i].fullname,                                            
            }) 
        return JsonResponse(flist, safe=False)
    

@login_required
def receive_patient(request):
    if request.method == 'POST':
        pid=request.POST.get('pid')
        cname=request.POST.get('cname')
        clid=request.POST.get('clid')
        vno=request.POST.get('vno')
        ptype=request.POST.get('ptype')
        today = date.today()
        consno=''
        
        if cname =='Eye' or cname=='Dental':
            #entry= specialConsult.objects.filter(op_number=pid,cons_date=today,specialClinic=clid).values('cons_date')
            
            #if not entry:
            cons_info=specialConsult()      
            cons_info.op_number = PatientBioData.objects.get(op_number = pid)
            cons_info.specialClinic = OpClinics.objects.get(clinic_name = cname)
            cons_info.save()
            #lastReff=specialConsult.objects.filter(op_number=pid).values('cons_reff').last()
            consno=cons_info.pk
        else:  
              
            #entry= Consultation.objects.filter(op_number=pid,cons_date=today).values('cons_date')
            #if not entry:

            #check if inpatient or outpatient to record the visit number
            if ptype=='In-Patient':
                cons_info=Consultation()      
                cons_info.op_number = PatientBioData.objects.get(op_number = pid)
                cons_info.wardName = IpWard.objects.get(wardName = clid)
                cons_info.visit_no_ip = IpVisit.objects.get(visitId = vno)
                cons_info.save()
                #lastReff=Consultation.objects.filter(op_number=pid).values('cons_reff').last()
                consno=cons_info.pk
            else:
                cons_info=Consultation()      
                cons_info.op_number = PatientBioData.objects.get(op_number = pid)
                cons_info.clinicName = OpClinics.objects.get(clinic_name = clid)
                cons_info.visit_no_op = OpVisits.objects.get(visitNo = vno)
                cons_info.save()
                #lastReff=Consultation.objects.filter(op_number=pid).values('cons_reff').last()
                consno=cons_info.pk       
        data={'consno':consno}
    return JsonResponse(data, safe=False)

#//load wards after inpatient category select

@login_required
def loadWards(request):
    if request.method == 'POST':
        wards = list(IpWard.objects.filter().values())
    return JsonResponse(wards, safe=False)

@login_required
def loadClinics(request):
    if request.method == 'POST':
        clinics = list(OpClinics.objects.filter().values())
    return JsonResponse(clinics, safe=False)


@login_required
def check_diagnosis_entry(request):
    if request.method == 'POST':
        pid=request.POST.get('pid')
        consno=request.POST.get('consno')
        startdate = datetime.now()     
        past24hrs = startdate - timedelta(hours=48)

        result = Consultation.objects.filter(op_number=pid,cons_date__gte=past24hrs,confirmed_diagnosis__isnull=False)
        data=[]
        if result.exists():
            data.append({
                'cd':'found'
            }) 
            """ for i in range(len(result)):            
                data.append({                
                        'cd':result[i].confirmed_diagnosis.disease_name,
                    }) """ 
        else:
            data.append({
                'cd':'none'
            })      
        return JsonResponse(data, safe=False)


@login_required
def cons_search_service(request):
    if request.method == 'POST':        
        search_str = json.loads(request.body).get('searchText')
        search_opt = json.loads(request.body).get('opt')
        svs=[]

        if search_opt =='1':                      
            svs = list(Services.objects.filter(service_name__icontains=search_str,service_point='nursing')[0:5].values())
        
        if search_opt =='2':                      
            svs = list(Services.objects.filter(service_name__icontains=search_str,service_point='laboratory')[0:5].values())

        if search_opt =='3':                      
            svs = list(Services.objects.filter(service_name__icontains=search_str,service_point='radiology')[0:5].values())        
        
        return JsonResponse(svs, safe=False)


@login_required
def cons_pharm_search(request):
    if request.method == 'POST':
        search_str = json.loads(request.body).get('searchText')
        patType = json.loads(request.body).get('pt')  
        stid = json.loads(request.body).get('stid')  
        data=[]
        
        sql =SubStoreItem.objects.select_related('itemCode','storeId').filter(itemCode__itemName__icontains=search_str,storeId=stid)[0:10]
        if sql:
            for i in range(len(sql)):
                data.append({
                    'item_code':sql[i].itemCode.itemId,
                    'item_name':sql[i].itemCode.itemName,
                    'strength':sql[i].itemCode.strength,
                    'price':sql[i].normalPrice,
                    'sprice':sql[i].specialPrice,
                    #'batch':sql[i].batchNo.batchNo,
                    'balance':sql[i].itemBalance,              
                    'storeName':sql[i].storeId.store_name,                                 
                    'servePoint':sql[i].storeId.store_name,              
                })  
        #if patType=='Out-Patient' or patType=='Day Care' or patType=='Walk-In':      
             
        """ elif patType=='In-Patient':
            sql =SubStoreItem.objects.select_related('itemCode','storeId','batchNo').filter(itemCode__itemName__icontains=search_str,storeId__servePoint='IPD',itemBalance__gt=0)[0:10]
            if sql:
                for i in range(len(sql)):
                    data.append({
                    'item_code':sql[i].itemCode.itemId,
                    'item_name':sql[i].itemCode.itemName,
                    'strength':sql[i].itemCode.strength,
                    'price':sql[i].normalPrice,
                    'sprice':sql[i].specialPrice,
                    #'batch':sql[i].batchNo.batchNo,
                    'balance':sql[i].itemBalance,              
                    'storeName':sql[i].storeId.store_name,                                 
                    'servePoint':sql[i].storeId.servePoint,              
                })  """       
        #print(data)
        return JsonResponse(data,safe=False)

@login_required
def cons_search_diagnosis(request):
    if request.method == 'POST':        
        search_str = json.loads(request.body).get('searchText')
        svs = list(Disease.objects.filter(disease_name__icontains=search_str)[0:5].values())        
        return JsonResponse(svs, safe=False)


@login_required
def triage_search(request):
    if request.method == 'POST': 
        startdate = datetime.now()     
        enddate = startdate - timedelta(hours=24)
        search_str = json.loads(request.body).get('searchText')
        triage=Triage.objects.filter(op_number=search_str,triage_date__gte=enddate).order_by('-triage_date','-triage_time')
        
        data=[]
        for i in range(len(triage)):
            data.append({
                'date':triage[i].triage_date,
                'time':triage[i].triage_time.strftime("%I:%M%p"),
                'urg':triage[i].urgency,
                'temp':triage[i].temperature,
                'press':triage[i].blood_pressure,
                'pulse':triage[i].pulse_rate,
                'wgt':triage[i].weight,
                'hgt':triage[i].height,
                'spo':triage[i].blood_oxygen,
                'muac':triage[i].muac,
                'notes':triage[i].nurse_notes,
                })     
               
        return JsonResponse(data, safe=False)


@login_required
def save_doctor_notes(request):
     if request.method=='POST':
         pid=json.loads(request.body).get('pid')
         ptype=json.loads(request.body).get('ptype')
         consNo=json.loads(request.body).get('consNo')
         vno=json.loads(request.body).get('vno')
         pnotes=json.loads(request.body).get('pnotes')
         hnotes=json.loads(request.body).get('hnotes')
         complain=json.loads(request.body).get('complains')
         tb=json.loads(request.body).get('tbd')
         for it in tb:
             
             screen = TbScreening()
             screen.opNumber=PatientBioData.objects.get(op_number=pid) 
             screen.visitId=OpVisits.objects.get(visitNo=vno)
             screen.indicator=TbIndicators.objects.get(indicator=it["code"])
             screen.status=it["status"]
             screen.comments=it["comment"]
             screen.doctor=CustomUser.objects.get(id=request.user.id)
             screen.save()

         """ prev_notes_instance=Consultation.objects.filter(op_number=pid,cons_date=today).values('doctor_notes').last()
         prev_notes=''
         for item in prev_notes_instance:
                prev_notes=str(item['doctor_notes'])
                if prev_notes=='None':
                    prev_notes=''  """
         
         cons_info=Consultation.objects.get(op_number=pid,cons_reff=consNo)        
         #all_notes=prev_notes+" "+pnotes        
         cons_info.doctor_notes=pnotes
         cons_info.hist_doctor_notes=hnotes
         cons_info.chief_complain=complain
         cons_info.doctor=CustomUser.objects.get(id=request.user.id)
         cons_info.save()

         ##save TbScreening
        
         data = {'msg': 'Clinical notes saved successfully'}
         return JsonResponse(data, safe=False)

@login_required
def saveAdmission(request):
     if request.method=='POST':
         bill=json.loads(request.body)         
         pb=bill["bill"] #it is the only main item in the dictionary 
         billLength=len(pb)
         if billLength >0 : 
            
            admModel=Admission()                 
            admModel.op_number=PatientBioData.objects.get(op_number=pb["pid"])
            admModel.doctor_notes=pb["pnotes"]
            admModel.ward=IpWard.objects.get(wardName=pb["ward"])
            admModel.save()           
            
            data = {'msg': 'Admission notes saved successfully'}
            return JsonResponse(data, safe=False)

@login_required
def saveClinicBook(request):
    if request.method=='POST':
         bill=json.loads(request.body)         
         pb=bill["bill"] #it is the only main item in the dictionary 
         billLength=len(pb)
         if billLength >0 :            
            admModel=ClinicBook()                 
            admModel.cardNo=PatientBioData.objects.get(op_number=pb["pid"])
            admModel.bookDate=pb["pdate"]
            admModel.bookType=pb["urgency"]            
            admModel.bookClinic=OpClinics.objects.get(clinic_code=pb["dept"])
            admModel.bookNotes=pb["pnotes"]
            admModel.save()           
            
            data = {'msg': 'Clinic booking saved'}
            return JsonResponse(data, safe=False)

@login_required
def save_diagnosis(request):
    if request.method=='POST':
        pid=request.POST.get('pid')
        diagName=request.POST.get('diag_name')
        diag_type=request.POST.get('diag_type')
        conid=request.POST.get('conid')
        userId=request.user.id

        today = date.today()
        #check if any notes entered within 48hrs
        cons_info=Consultation.objects.get(op_number=pid,cons_reff=conid)       

        if diag_type=='Provisional':
            cons_info.provisional_diagnosis=Disease.objects.get(disease_name = diagName)
            cons_info.doctor =CustomUser.objects.get(id=userId)
            cons_info.save()

        elif diag_type=='Confirmed':
            cons_info.confirmed_diagnosis=Disease.objects.get(disease_name = diagName)
            cons_info.doctor =CustomUser.objects.get(id=userId)
            cons_info.save()
        
        data = {'res': 'patient diagnosis saved successfully'}
        return JsonResponse(data, safe=False)

@login_required
def save_svs_request(request):
    if request.method =='POST':       
        today = date.today()
        userId=request.user.id
        bill=json.loads(request.body)
        pb=bill["bill"] #it is the only main item in the dictionary 
        svs="" 
        op_no=0
        consno=0
        billLength=len(pb) 
        
        if billLength >0 :      
            for i in range(billLength):
                billInfo = PatientBill()
                billInfo.op_number=PatientBioData.objects.get(op_number = pb[i]["op_no"])
                op_no= pb[i]["op_no"]
                consno= pb[i]["consno"]
                pymode=pb[i]["pym"]

                billInfo.paymode=pymode
                billInfo.patient_type=pb[i]["ptype"]
                billInfo.bill_point=pb[i]["dpt"]
                billInfo.service=Services.objects.get(scode = pb[i]["code"])
                svs+=pb[i]["svc"]+" "
                billInfo.quantity=1
                billInfo.total_price=pb[i]["cost"]
                billInfo.pay_status=pb[i]["pyst"]
                billInfo.visitNo=OpVisits.objects.get(visitNo=pb[i]["vno"])
                billInfo.visitStatus='open'
                if pymode=='cash':
                    billInfo.status='billed'
                else:
                    billInfo.status='paid'
                    
                billInfo.invoice_status='pending'
                billInfo.billed_by =CustomUser.objects.get(id=userId)

                billInfo.save()

            #timenow=today.strftime("%H:%M:%S") 
            #supposed to enter into ServiceRequest model
            cons_info=Consultation.objects.get(op_number=op_no,cons_reff=consno)
            if cons_info:  
                svs_instance=Consultation.objects.filter(op_number=op_no,cons_date=today,cons_reff=consno).values('service')
                
                for item in svs_instance:
                    svs+=str(item['service'])+","
                        
                cons_info.service=svs
                cons_info.cons_leave_time=datetime.time(datetime.now())
                cons_info.save()             
            res = {
                'msg': 'request(s) saved successfully'
            }
            return JsonResponse(res)


@login_required
def save_special_request(request):
    if request.method =='POST':       
        today = date.today()
        userId=request.user.id
        bill=json.loads(request.body)
        pb=bill["bill"] #it is the only main item in the dictionary 
        svs="" 
        op_no=0
        consno=0
        billLength=len(pb) 
        if billLength >0 :      
            for i in range(billLength):
                billInfo = PatientBill()
                billInfo.op_number=PatientBioData.objects.get(op_number = pb[i]["op_no"])
                op_no= pb[i]["op_no"]
                consno= pb[i]["consno"]

                billInfo.paymode=pb[i]["pym"]
                billInfo.patient_type=pb[i]["ptype"]
                billInfo.bill_point=pb[i]["dpt"]
                billInfo.service=Services.objects.get(scode = pb[i]["code"])
                svs+=pb[i]["svc"]+" "
                billInfo.quantity=1
                billInfo.total_price=pb[i]["cost"]
                billInfo.pay_status=pb[i]["pyst"]
                billInfo.visitNo=OpVisits.objects.get(visitNo=pb[i]["vno"])
                billInfo.visitStatus='open'
                billInfo.status='pending'
                billInfo.invoice_status='pending'
                billInfo.billed_by =CustomUser.objects.get(id=userId)

                billInfo.save()

            #timenow=today.strftime("%H:%M:%S") 
            #supposed to enter into ServiceRequest model
            cons_info=specialConsult.objects.get(op_number=op_no,cons_reff=consno)
            if cons_info:  
                svs_instance=specialConsult.objects.filter(op_number=op_no,cons_reff=consno).values('service')
                
                for item in svs_instance:
                    svs+=str(item['service'])+","
                        
                cons_info.service=svs
                cons_info.cons_leave_time=datetime.time(datetime.now())
                cons_info.save()             
            res = {
                'msg': 'request(s) saved successfully'
            }
            return JsonResponse(res)


@login_required
def savePrescription(request):
    if request.method =='POST':
        pres=json.loads(request.body)
        bill=pres['bill']
        cardNo=0
        cons_type=''
        userId=request.user.id
        
        datenow = datetime.now()
        ptag=datenow.strftime('%S%I%M%m%d') 
        
        if len(bill) > 0:            
            for i in range(len(bill)):
                prescModel = Prescription()
                cardNo= bill[i]["op_no"]
                consno= bill[i]["consno"]
                qnt= bill[i]["qnt"]
                cons_type= bill[i]["cons_type"]
                ttp= int(bill[i]["price"])*int(qnt)
                
                prescModel.opNumber=PatientBioData.objects.get(op_number = cardNo)            
                prescModel.itemCode= DrugGeneralItem.objects.get(itemId = bill[i]["code"]) 
                prescModel.storeId= Store.objects.get(store_name= bill[i]["storeName"])            
                prescModel.dosage=bill[i]["dose"]
                prescModel.frequency=bill[i]["freq"]
                prescModel.days=bill[i]["day"]
                prescModel.quantity=qnt
                prescModel.price=ttp
                prescModel.status='pending'
                prescModel.visitOp =OpVisits.objects.get(visitNo=bill[i]["vno"])
                prescModel.doctor =CustomUser.objects.get(id=userId)
                prescModel.prescription_tag=ptag
                prescModel.save()      

            
            consModel=''
            if cons_type=='general':
                consModel=Consultation.objects.get(op_number=cardNo,cons_reff=consno)
            elif cons_type=='special': 
                consModel=specialConsult.objects.get(op_number=cardNo,cons_reff=consno) 

            consModel.cons_leave_date=datetime.now()
            consModel.cons_leave_time=datetime.time(datetime.now())
            consModel.save()        
            res = {
                'msg': 'Prescription saved successfully'
            }
            return JsonResponse(res, safe=False)


@login_required
def listDestination(request):
    if request.method == 'POST':
        rtype = json.loads(request.body).get('searchText')        
        data=[]
        
        if rtype=='internal' :     
            query =OpClinics.objects.all()         
            if query:
                
                for i in range(len(query)):
                    data.append({
                    'desid':query[i].clinic_code,
                    'desname':query[i].clinic_name,
                }) 
        elif rtype=='external':
            query =referalFacility.objects.all()
            if query:
               for i in range(len(query)):
                    data.append({
                    'desid':query[i].facilityId,
                    'desname':query[i].facilityName,
                })        
        
        return JsonResponse(data,safe=False)

@login_required
def saveReferral(request):
     if request.method=='POST':
        pid=json.loads(request.body).get('pid') 
        rfrom=json.loads(request.body).get('rfrom')
        rfdes=json.loads(request.body).get('rfdes')
        rftype=json.loads(request.body).get('rftype')
        rfnotes=json.loads(request.body).get('rfnotes')
        vno=json.loads(request.body).get('vno')
        userId=request.user.id
        
        query=patientReferral()
        query.cardNo=PatientBioData.objects.get(op_number=pid)
        query.referralType=rftype
        query.referralFrom=OpClinics.objects.get(clinic_name=rfrom)
        query.referralToINT=OpClinics.objects.get(clinic_code=rfdes)
        query.referralNotes=rfnotes
        query.doctor =CustomUser.objects.get(id=userId)
        query.save()
        data={'msg':'Referral saved successfully'}

        if rftype=='internal':
            cons_info=Consultation()      
            cons_info.op_number = PatientBioData.objects.get(op_number = pid)
            cons_info.clinicName = OpClinics.objects.get(clinic_code=rfdes)
            cons_info.visit_no_op = OpVisits.objects.get(visitNo = vno)
            cons_info.save()


        
        return JsonResponse(data,safe=False)


@login_required
def referralOpvisit(request):
    if request.method=='POST':
        opvisit = OpVisits()
        datenow = datetime.now()
        cdate = datenow.date()
        ctime=datenow.time()
        
        opvisit.clinic_name = OpClinics.objects.get(clinic_name = request.POST.get('clname'))    
        opvisit.subname = Schemes.objects.get(sub_name = request.POST.get('schname'))
        opvisit.op_number = PatientBioData.objects.get(op_number = request.POST.get('pid'))
        opvisit.visit_type = request.POST.get('vtype')
        opvisit.visit_date =cdate 
        opvisit.visit_time =ctime
        opvisit.staff =request.user.id 
        opvisit.save()
        res={"msg":"saved"}   

    return JsonResponse(res, safe=False)

############ mch and fp #################
@login_required
def consmchpage(request):
    mch=mchClinic.objects.all()   
    fpmethod=famPlanMethod.objects.all()   
    vaccines=immuneVaccine.objects.distinct('vaccineName','acronym')   
    context = {
        'mchclinic':mch,      
        'fpmethod':fpmethod,
        'vaccines':vaccines    
    }    
    return render(request, 'dashboard/consult/consult_mchfp.html',context)


@login_required
def searchMatProfile(request):
    if request.method=='POST':
        today = date.today()
        enddate=today-relativedelta(months=+12)
        search_str = json.loads(request.body).get('searchText')   

        patient =mchAncProfile.objects.filter(cardNumber=search_str,profileDate__range=[enddate,today]) 
   
        profile=[]
        if patient:      
            
            for i in range(len(patient)):                
                profile.append({
                'pfid':patient[i].profileId,
                'kmcode':patient[i].KMHFLCode,
                'ancno':patient[i].ancNumber,
                'grav':patient[i].gravida,
                'parity':patient[i].parity,
                'height':patient[i].height,
                'weight':patient[i].weight,
                'lmp':patient[i].lmp,
                'edd':patient[i].edd,
                'sop':patient[i].surgicalOp,
                'diab':patient[i].diabetis,
                'hp':patient[i].hypertension,
                'bld':patient[i].bloodTransfusion,             
                'tb':patient[i].tuberculosis,             
                'allg':patient[i].drugAllergy,            
                'allgo':patient[i].otherAllergies,            
                'ft':patient[i].familyTwins,            
                'notes':patient[i].addNotes                        
            })      
        
        return JsonResponse(profile, safe=False)

@login_required
def saveMatProfile(request):
    if request.method=='POST':
        #datenow = datetime.now()
        #cdate = datenow.date()
        #ctime=datenow.time()
        prof=mchAncProfile()
        data={}
        newProfId=0
        userId=request.user.id

        pid=request.POST.get('profid')
       

        if pid=='' or pid is Empty:
            prof.KMHFLCode = request.POST.get('kmhfl')
            prof.ancNumber = request.POST.get('ancno')
            prof.gravida = request.POST.get('gravida')
            prof.parity = request.POST.get('parity')
            prof.height = request.POST.get('height')
            prof.weight = request.POST.get('weight')
            prof.lmp = request.POST.get('lmp')
            prof.edd = request.POST.get('edd')
            prof.cardNumber =  PatientBioData.objects.get(op_number = request.POST.get('cardNo'))
            prof.recordBy =CustomUser.objects.get(id=userId)
            prof.save()

            newProfId = mchAncProfile.objects.latest('profileId').profileId
            
            data = {'msg': f'saved successfully', 'id': newProfId}

        elif len(pid) >0:
            prof=mchAncProfile.objects.get(profileId=pid)
            prof.KMHFLCode = request.POST.get('kmhfl')
            prof.ancNumber = request.POST.get('ancno')
            prof.gravida = request.POST.get('gravida')
            prof.parity = request.POST.get('parity')
            prof.height = request.POST.get('height')
            prof.weight = request.POST.get('weight')
            prof.lmp = request.POST.get('lmp')
            prof.edd = request.POST.get('edd')
            prof.recordBy =CustomUser.objects.get(id=userId)
            prof.save()     
            
            data = {'msg': f'edited successfully', 'id': newProfId}           
        
    return JsonResponse(data,safe=False)


@login_required
def saveMSHProfile(request):
    if request.method=='POST':        
        pid=request.POST.get('profid2')        
        data={}
        
        if pid=='' or pid is Empty:
            data = {'msg': f'profile number empty', 'id': pid}

        elif len(pid) >0:
            prof=mchAncProfile.objects.get(profileId=pid)

            prof.surgicalOp = request.POST.get('sop')
            prof.diabetis = request.POST.get('diab')
            prof.hypertension = request.POST.get('htn')
            prof.bloodTransfusion = request.POST.get('bldtrans')
            prof.tuberculosis = request.POST.get('tb')
            prof.drugAllergy = request.POST.get('allergy')
            prof.otherAllergies = request.POST.get('otherallg')
            prof.familyTwins = request.POST.get('ftwins')
            prof.addNotes = request.POST.get('ancnotes')
            prof.save()     
            
            data = {'msg': f'saved successfully', 'id': pid}           
        
    return JsonResponse(data,safe=False)


@login_required
def saveprevPregnancy(request):
    if request.method=='POST':        
        pid=request.POST.get('profidpp')        
        data={}  
              
        if pid=='' or pid is Empty:
            data = {'msg': f'profile number empty', 'id': pid}

        elif len(pid) >0:
            prof=previousAncPregancy()

            prof.profileId=mchAncProfile.objects.get(profileId=pid)
            prof.PregnancyOrder=request.POST.get('pregorder')
            prof.YearOfBirth=request.POST.get('yob')
            prof.ancPerpregnacy=request.POST.get('cln')
            prof.placeOfBirth= request.POST.get('pob')
            prof.gestationPeriod= request.POST.get('gestp')
            prof.labourPeriod= request.POST.get('labd')
            prof.deliveryMode= request.POST.get('delmode')
            prof.birthWeight= request.POST.get('birthw')            
            prof.childsex= request.POST.get('sex')
            prof.outcome= request.POST.get('outcome')
            prof.puerperium= request.POST.get('pprm')            
            prof.save()     
            
            data = {'msg': f'saved successfully', 'id': pid}           
        
    return JsonResponse(data,safe=False)


@login_required
def saveancfirstVisit(request):
    if request.method=='POST':        
        profid=request.POST.get('profidAnc')        
        pid=request.POST.get('cardNo2')  

        today = date.today()
        enddate=today-relativedelta(months=+12)      
        data={}  
        visit='first'  
        if pid=='' or pid is Empty:
            data = {'msg': f'profile number empty. ensure profile exists', 'id': pid}

        elif len(pid) >0:
            prof=ancVisits()
            prof.profileNumber=mchAncProfile.objects.get(profileId=profid)            
            prof.cardNumber=PatientBioData.objects.get(op_number=pid)
            prof.ancType=visit
            prof.generalExam=request.POST.get('genExam')
            prof.bloodPress=request.POST.get('bp')
            prof.pulseRate=request.POST.get('prate')
            prof.breast= request.POST.get('breasts')
            prof.abdomen= request.POST.get('abdm')
            prof.genitaliaExam= request.POST.get('gentExam')
            prof.genitalDischarge= request.POST.get('genUlcer')                        
            prof.save()                 
            data = {'msg': f'saved successfully', 'id': pid}

            """
            #first check if anc first visit was captured
            checkpat=ancVisits.objects.filter(cardNumber=pid,profileDate__range=[enddate,today],ancType='first')
            if checkpat:
                #update details
                prof=ancVisits.objects.get(profileNumber=profid)
                prof.ancType=visit
                prof.generalExam=request.POST.get('genExam')
                prof.bloodPress=request.POST.get('bp')
                prof.pulseRate=request.POST.get('prate')
                prof.breast= request.POST.get('breasts')
                prof.abdomen= request.POST.get('abdm')
                prof.genitaliaExam= request.POST.get('gentExam')
                prof.genitalDischarge= request.POST.get('genUlcer')                        
                prof.save()                 
                data = {'msg': f'saved successfully', 'id': pid}


            else:
                prof=ancVisits()
                prof.profileNumber=mchAncProfile.objects.get(profileId=profid)            
                prof.cardNumber=PatientBioData.objects.get(op_number=pid)
                prof.ancType=visit
                prof.generalExam=request.POST.get('genExam')
                prof.bloodPress=request.POST.get('bp')
                prof.pulseRate=request.POST.get('prate')
                prof.breast= request.POST.get('breasts')
                prof.abdomen= request.POST.get('abdm')
                prof.genitaliaExam= request.POST.get('gentExam')
                prof.genitalDischarge= request.POST.get('genUlcer')                        
                prof.save()                 
                data = {'msg': f'saved successfully', 'id': pid} """         
        
    return JsonResponse(data,safe=False)


@login_required
def saveAntprofVisit(request):
    if request.method=='POST':        
        profid=request.POST.get('profidAnc2')        
        pid=request.POST.get('cardNo3')  

        today = date.today()
        enddate=today-relativedelta(months=+12)      
        data={}  
        visit='first'  
        if pid=='' or pid is Empty:
            data = {'msg': f'profile number empty. ensure profile exists', 'id': pid}

        elif len(pid) >0:
            #first check if anc first visit was captured
            checkpat=ancVisits.objects.filter(cardNumber=pid,profileDate__range=[enddate,today],ancType='first')
            if checkpat:
                #update details
                prof=ancVisits.objects.get(profileNumber=profid)
                prof.ancType=visit
                prof.HB=request.POST.get('hb')
                prof.bloodGroup=request.POST.get('bgroup')
                prof.rhesus=request.POST.get('rhesus')
                prof.urinalyis= request.POST.get('urinalysis')
                prof.bloodRbs= request.POST.get('rbs')
                prof.TB= request.POST.get('tbtest')
                prof.HIV= request.POST.get('hiv')                        
                prof.syphilis= request.POST.get('syphilis')                        
                prof.hepatitisB= request.POST.get('hepatts')                        
                prof.hivCounsel= request.POST.get('hivCouns')                        
                prof.partnerHivTest= request.POST.get('phiv')                                        
                prof.save()                 
                data = {'msg': f'saved successfully', 'id': pid}

            else:                      
                data = {'msg': f'confirm first visit details exists', 'id': pid}          
        
    return JsonResponse(data,safe=False)
    

@login_required
def savesubseqAncVisit(request):
    if request.method=='POST':        
        profid=request.POST.get('profid4')        
        pid=request.POST.get('cardno4')  

        today = date.today()
        enddate=today-relativedelta(months=+12)      
        data={}  
         
        if pid=='' or pid is Empty:
            data = {'msg': f'profile number empty. ensure profile exists', 'id': pid}

        elif len(pid) >0:
            #first check if anc first visit was captured
            checkpat=ancVisits.objects.filter(cardNumber=pid,profileDate__range=[enddate,today],ancType='first')
            if checkpat:
                #update details
                prof=ancVisits()
                prof.profileNumber=mchAncProfile.objects.get(profileId=profid)            
                prof.cardNumber=PatientBioData.objects.get(op_number=pid)
                prof.ancType=request.POST.get('vstcnt')
                prof.muacHeight=request.POST.get('muac')
                prof.bloodPress=request.POST.get('bp')
                prof.pulseRate=request.POST.get('prate')
                prof.weight=request.POST.get('weight')
                prof.pallor=request.POST.get('pallor')
                prof.gestationPeriod=request.POST.get('gest')
                prof.fundalHeight=request.POST.get('fheight')
                prof.presentation= request.POST.get('pres')
                prof.foetalHeartRate= request.POST.get('fhrate')
                prof.foetalHeartMvt= request.POST.get('ftmvt')
                prof.clinicalNotes= request.POST.get('ancnotes')                        
                prof.nextVisit= request.POST.get('nvstdate') 
                prof.save()                 
                data = {'msg': f'saved successfully', 'id': pid}

            else:                      
                data = {'msg': f'confirm first visit details exists', 'id': pid}          
        
    return JsonResponse(data,safe=False)


@login_required
def loadVaccineTime(request):
    if request.method == 'POST':
        search_str = json.loads(request.body).get('searchText')
        vaccTime = immuneVaccine.objects.filter(vaccineName=search_str)
        data = vaccTime.values()
        return JsonResponse(list(data), safe=False)


@login_required
def listmaidenbaby(request):
    if request.method == 'POST':        
        search_str = json.loads(request.body).get('searchText')
        data = list(pncbaby.objects.filter(maidenNumber=search_str).values())        
        return JsonResponse(data, safe=False)


@login_required
def listVaccVisit(request):
    if request.method == 'POST':
        search_str = json.loads(request.body).get('searchText')          
        data=[]               
        sql =babyVaccine.objects.select_related('vaccineName').filter(babyNo=search_str).order_by('immunizationId')
        for i in range(len(sql)):
            data.append({
            'id':sql[i].immunizationId,
            'vname':sql[i].vaccineName.acronym,
            'vperiod':sql[i].vaccinePeriod,
            'vdate':sql[i].vaccineDate,                  
         })
    return JsonResponse(data, safe=False)


@login_required    
def saveImmunization(request):
    if request.method=='POST':

        prof=babyVaccine()
        prof.vaccineName=immuneVaccine.objects.distinct('vaccineName').get(vaccineName=request.POST.get('vaccinename'))
        prof.babyNo=pncbaby.objects.get(babyId=request.POST.get('bno'))
        prof.maidenNo=PatientBioData.objects.get(op_number=request.POST.get('mdno'))
        prof.vaccinePeriod=request.POST.get('vaccineprd')
        prof.nextDate= request.POST.get('nxdate')                      
        prof.save() 
            
    data = {'msg': f'saved successfully'}
    return JsonResponse(data,safe=False)


@login_required
def saveImmEffect(request):
    if request.method=='POST':

        prof=vaccineComplain()
        prof.vaccineName=immuneVaccine.objects.distinct('vaccineName').get(vaccineName=request.POST.get('vaccinename'))
        prof.babyNo=pncbaby.objects.get(babyId=request.POST.get('bbyname'))
        prof.maidenNo=PatientBioData.objects.get(op_number=request.POST.get('mddno'))
        prof.manufacturer=request.POST.get('mname')
        prof.manufactureDate= request.POST.get('mndate')                      
        prof.expiryDate= request.POST.get('expdate')                      
        prof.complainDescription= request.POST.get('cmpnotes')                      
        prof.save() 
            
    data = {'msg': f'saved successfully'}
    return JsonResponse(data,safe=False)


@login_required
def savemaidenpncVisit(request):
    if request.method=='POST':        
        pid=request.POST.get('mdnnumber')        
        vprd=request.POST.get('vperiod') 
        today = date.today()
        enddate=today-relativedelta(months=+12) 
        nxtDate=today+relativedelta(months=+1)     
        data={} 
        #checkpat=pncVisit.objects.filter(cardNumber=pid,visitDate__range=[enddate,today],visitperiod=vprd)
        prof=pncVisit()                       
        prof.cardNumber=PatientBioData.objects.get(op_number=pid)            
        prof.visitperiod=vprd
        prof.bloodPress=request.POST.get('bp')
        prof.pulseRate=request.POST.get('prate')
        prof.temperature=request.POST.get('temp')
        prof.weight=request.POST.get('weight')
        prof.generalExam=request.POST.get('genExam')            
        prof.breast= request.POST.get('breasts')
        prof.csScar= request.POST.get('scar')
        prof.uterusInvolution= request.POST.get('uterus')
        prof.pelvicExam= request.POST.get('pelExam')                        
        prof.episiotomy= request.POST.get('tear')                        
        prof.fistula= request.POST.get('fistula')                        
        prof.lochia= request.POST.get('lochia')                        
        prof.hivStatus= request.POST.get('hiv') 
        prof.counseling= request.POST.get('pfcouns') 
        prof.fpMethod= request.POST.get('fpmethod') 
        prof.fpSpec= request.POST.get('fpspec') 
        prof.nextVisit= nxtDate 
        prof.clinicalNotes= request.POST.get('pncmnotes')
        prof.save()                 
        data = {'msg': f'saved successfully'}
                            
            
            #update the record
        return JsonResponse(data,safe=False)

@login_required
def savebabypncVisit(request):
    if request.method=='POST':        
        pid=request.POST.get('mdnnumber2')        
        vprd=request.POST.get('vperiod2') 
        bbno=request.POST.get('babynumber')       
        data={}        
        #insert new record
        prof=pncBabyVisit()                       
        prof.cardNumber=PatientBioData.objects.get(op_number=pid)            
        prof.babyNo=pncbaby.objects.get(babyId=bbno)            
        prof.visitperiod=vprd
        prof.generalExam=request.POST.get('genExam')
        prof.temperature=request.POST.get('temp')
        prof.pulserate=request.POST.get('prate')
        prof.weight=request.POST.get('weight')
        prof.feedMethod=request.POST.get('fdmethod')
        prof.breastFeed= request.POST.get('brfeed')
        prof.umbilicalCord= request.POST.get('umbcord')
        prof.nextVisit= request.POST.get('nvisit') 
        prof.clinicalNotes= request.POST.get('pncbbnotes')
        prof.save()                 
        data = {'msg': f'saved successfully'}

    return JsonResponse(data,safe=False)

    

@login_required
def listfpPlan(request):
    if request.method == 'POST':
        search_str = json.loads(request.body).get('searchText')          
        data=[]               
        sql =familyPlan.objects.filter(cardNumber=search_str).order_by('fpId')
        for i in range(len(sql)):
            data.append({
            'id':sql[i].fpId,
            'method':sql[i].fpmethod.description,            
            'vdate':sql[i].adminDate, 
            'status':sql[i].status, 

         })
    return JsonResponse(data, safe=False)


@login_required
def administerFp(request):
    if request.method=='POST':        
        #insert new record
        prof=familyPlan()                       
        prof.cardNumber=PatientBioData.objects.get(op_number=request.POST.get('mdfpno'))            
        prof.fpno=request.POST.get('fpno')             
        prof.fpmethod=famPlanMethod.objects.get(acronym=request.POST.get('fpmethod'))
        prof.adminDate=request.POST.get('addate')
        prof.endDate=request.POST.get('exdate')
        prof.quantity=request.POST.get('qnty')        
        prof.discReason='active'        
        prof.save()                 
        data = {'msg': f'Administered successfully'}

    return JsonResponse(data,safe=False)


@login_required
def discontinueFp(request):
    if request.method=='POST':        
        #insert new record
        prof=familyPlan.objects.get(fpId=request.POST.get('fpid')) 
        prof.status='inactive'
        prof.discReason=request.POST.get('reason')
        prof.save()                 
        data = {'msg': f'plan discontinued'}

    return JsonResponse(data,safe=False)



@login_required
def saveFpEffect(request):
    if request.method=='POST':
        prof=familyPlanComplain()            
        prof.cardnumber=PatientBioData.objects.get(op_number=request.POST.get('cardno'))
        prof.fpmethod=famPlanMethod.objects.get(acronym=request.POST.get('fpmethodEff') )
        prof.batchno=request.POST.get('btnumber')
        prof.manufacturer=request.POST.get('mname')
        prof.manufactureDate= request.POST.get('mndate')                      
        prof.expiryDate= request.POST.get('expdate')                      
        prof.complainDescription= request.POST.get('cmpnotes')                      
        prof.save() 
            
    data = {'msg': f' Complain Recorded'}
    return JsonResponse(data,safe=False)


############ special clinics #################
@login_required
def conspecialpage(request):
    patType = PatientType.objects.all()
    wards = IpWard.objects.all()
    clinics = SpecialClinic.objects.all().order_by('clinicName')
    eyecond=specialClinicCondition.objects.all().filter(spDepartment='Eye')
    eyeproc=specialClinicProcedure.objects.all().filter(spDepartment='Eye')
    context = {       
        'patType':patType,
        'wards':wards,
        'clinics':clinics,
        'eyecond':eyecond,
        'eyeproc':eyeproc
    } 
    
    return render(request, 'dashboard/consult/consult_special.html',context)

@login_required
def consult_eye_page(request):
    patType = PatientType.objects.all()
    wards = IpWard.objects.all()
    clinics = OpClinics.objects.filter(clinic_type='Special').order_by('clinic_name')
    #clinics = SpecialClinic.objects.all().order_by('clinicName')
    eyecond=specialClinicCondition.objects.all().filter(spDepartment='Eye').order_by('conditionName')
    eyeproc=specialClinicProcedure.objects.all().filter(spDepartment='Eye').order_by('procedureName')
    stores = Store.objects.filter(category='Sub Store')
    context = {       
        'patType':patType,
        'wards':wards,
        'clinics':clinics,
        'eyecond':eyecond,
        'eyeproc':eyeproc,
        'stores':stores
    } 
    
    return render(request, 'dashboard/consult/consult_eye.html',context)


@login_required
def savespnotes(request):
     if request.method=='POST':
        
        pid=request.POST.get('spid')
        rac1=request.POST.get('rnum')
        rac2=request.POST.get('rden')
        lac1=request.POST.get('lnum')
        lac2=request.POST.get('lden')
        consNo=request.POST.get('consnumber')
        
        racuity=str(rac1)+'/'+str(rac2)
        lacuity=str(lac1)+'/'+str(lac2)
        
        datenow = datetime.now()
        today = datenow.date()
        ctime=datenow.time()

        #cname=request.POST.get('sclname')
        cname='Eye'

        cons_info=specialConsult.objects.get(cons_reff=consNo,op_number=pid)
        
        cons_info.specialClinic=OpClinics.objects.get(clinic_name=cname)
        cons_info.op_number=PatientBioData.objects.get(op_number=pid)  
        cons_info.complainFindings=request.POST.get('compExFind')
        cons_info.additionNotes=request.POST.get('additionEyeNotes')        
        cons_info.cons_leave_time=ctime

        if cname=='Eye':            
            cons_info.acuityleft=lacuity
            cons_info.acuityright=racuity
            cons_info.eyepartselect=request.POST.get('eyeselect')  
            cons_info.condition=specialClinicCondition.objects.get(conditionName=request.POST.get('eyeCondition'))
            cons_info.procedure=specialClinicProcedure.objects.get(procedureId=request.POST.get('eyeprocedure'))        
            
        
        elif cname=='Dental':            
            cons_info.dentalptype=request.POST.get('denpatcat')
            cons_info.toothselect=request.POST.get('thselect')
            cons_info.condition=specialClinicCondition.objects.get(conditionId=request.POST.get('dencondition'))
            cons_info.procedure=specialClinicProcedure.objects.get(procedureId=request.POST.get('denprocedure'))                   
            

        cons_info.save()
        data = {'msg': 'clerking notes saved successfully'}
        return JsonResponse(data, safe=False)


@login_required
def findprevnotes(request):
    if request.method == 'POST': 
        startdate = date.today()
        enddate = startdate - timedelta(days=1)
        search_str = json.loads(request.body).get('searchText')
        cons=Consultation.objects.filter(op_number=search_str,cons_date__gte=enddate).exclude(doctor_notes__isnull=True).values('confirmed_diagnosis__disease_name','provisional_diagnosis__disease_name','cons_date','cons_receive_time','hist_doctor_notes','doctor_notes','doctor__username','service').order_by('cons_reff')
        data=[]
        for i in range(len(cons)):
            data.append({
                'cdate':cons[i]['cons_date'],
                'ctime':cons[i]['cons_receive_time'],
                'hist':cons[i]['hist_doctor_notes'],
                'phnotes':cons[i]['doctor_notes'],
                'pdiag':cons[i]['provisional_diagnosis__disease_name'],
                'cdiag':cons[i]['confirmed_diagnosis__disease_name'],                
                'doc':cons[i]['doctor__username'],
                'svs':cons[i]['service'],               
                })         
        return JsonResponse(data, safe=False)

    
@login_required
def patcard(request):
    if request.method == 'POST': 
        import datetime
        pno = json.loads(request.body).get('pno')
        fdate = json.loads(request.body).get('fdate')
        tdate = json.loads(request.body).get('tdate')
        chbox = json.loads(request.body).get('chkdate')
        ptype = json.loads(request.body).get('ptype')
        vno=[]
        visitno=0
        cons=''
        ttdate = datetime.datetime.strptime(tdate, '%Y-%m-%d')
        todate=ttdate + timedelta(hours=23,minutes=59,seconds=59)
        if chbox=='checked':
            cons=Consultation.objects.filter(op_number=pno,cons_date__range=[fdate,todate]).exclude(doctor_notes__isnull=True).order_by('-cons_date') #.values('visit_no_op','confirmed_diagnosis__disease_name','provisional_diagnosis__disease_name','cons_date','cons_receive_time','hist_doctor_notes','doctor_notes','doctor__username','service').order_by('cons_reff')
        elif chbox=='all':
            cons=Consultation.objects.filter(op_number=pno).exclude(doctor_notes__isnull=True).order_by('-cons_date')#.values('visit_no_op','confirmed_diagnosis__disease_name','provisional_diagnosis__disease_name','cons_date','cons_receive_time','hist_doctor_notes','doctor_notes','doctor__username','service').order_by('cons_reff')
        data=[]
        vnop=[]
        vnip=[]
        prescdrg=''
        for i in range(len(cons)): 
            ppdiag=''
            ccdiag=''
            prescdrg=''
            dispdrg=''
            dispby=''
            
            if cons[i].provisional_diagnosis is None:
                ppdiag='none'
            else:
                ppdiag=cons[i].provisional_diagnosis.disease_name

            if cons[i].confirmed_diagnosis is None:
                ccdiag=''
            else:
                ccdiag=cons[i].confirmed_diagnosis.disease_name

        
            if cons[i].visit_no_op is None:
                pass
            else:
                vsno=cons[i].visit_no_op.visitNo
                #search prescription && dispensation
                presc=Prescription.objects.filter(visitOp=vsno).values('itemCode__itemName','dosage','frequency','days')                  
                pdrug=list(presc)                
                for dr in range(len(pdrug)):
                    prescdrg+=str("(")+str(dr+1)+str(")"+pdrug[dr]['itemCode__itemName'])+"("+str(pdrug[dr]['dosage'])+" x "+str(pdrug[dr]['frequency'])+')-'+str(pdrug[dr]['days'])+' days'+"<br>"
                
                disp=PharmDispense.objects.filter(reffno__visitNo=vsno).values('drug_item__itemName','dosage','frequency','days','quant','pharmacist__username')                  
                ddrug=list(disp)                
                for pdr in range(len(ddrug)):
                    dispdrg+=str("(")+str(pdr+1)+str(")"+ddrug[pdr]['drug_item__itemName'])+"("+str(ddrug[pdr]['dosage'])+" x "+str(ddrug[pdr]['frequency'])+')-'+str(ddrug[pdr]['days'])+' days'+' Qnty:'+str(ddrug[pdr]['quant'])+"<br>"
                    dispby=ddrug[pdr]['pharmacist__username']

            if cons[i].visit_no_ip is None:
                pass
            else:
                vnip.append(cons[i].visit_no_ip.visitId)

            
            
            data.append({ 
                'cdate':cons[i].cons_date.strftime('%d-%m-%Y'),
                'ctime':cons[i].cons_receive_time.strftime('%I:%M%p'),
                'ccomplain':cons[i].chief_complain,
                'hist':cons[i].hist_doctor_notes,
                'phnotes':cons[i].doctor_notes,
                'cnotes':cons[i].continuation_notes,
                'pdiag':ppdiag,
                'cdiag':ccdiag,                
                'doc':cons[i].doctor.username,
                'svs':cons[i].service,
                'presc':prescdrg, 
                'disp':dispdrg,
                'pharmacist':dispby          
                })
            
        
        return JsonResponse(data, safe=False)

################ eye unit additional methods #########################
def waitlist_eye(request):
    if request.method=='POST':
        data=[]
        startdate = datetime.now()     
        enddate = startdate - timedelta(hours=24)
        patient=OpVisits.objects.filter(visit_date__gte=enddate,clinic_name__clinic_name='Eye').order_by('visit_date','visit_time')   
        if patient:             
            for i in range(len(patient)):                
                data.append({
                'subname':patient[i].subname.sub_name,
                'pmode':patient[i].subname.scheme_name,
                'pno':patient[i].op_number.op_number,
                'pname':patient[i].op_number.fullname,
                'age':patient[i].op_number.patient_age,
                'gender':patient[i].op_number.gender,             
                'vdate':patient[i].visit_date,             
                'vno':patient[i].visitNo,
                'vtime':patient[i].visit_time.strftime("%I:%M%p")                             
            })
        
        return JsonResponse(data, safe=False)

@login_required
def check_eyediagnosis_entry(request):
    if request.method == 'POST':
        pid=request.POST.get('pid')
        consno=request.POST.get('consno')
        today=date.today()

        result = specialConsult.objects.filter(op_number=pid,cons_date=today) #cons_reff=consno
        data=[]
        if result.exists():
            for i in range(len(result)):
                if result[i].condition is None: 
                    data.append({'cd':'none'})
                else:
                    data.clear()
                    data.append({                
                        'cd':result[i].condition.conditionName,
                    })

                    break           
        return JsonResponse(data, safe=False)
    


################ Dental unit additional methods #########################


@login_required
def consult_dental(request):
    patType = PatientType.objects.all()
    wards = IpWard.objects.all()
    clinics = SpecialClinic.objects.all().order_by('clinicName')
    dentcond=specialClinicCondition.objects.all().filter(spDepartment='Dental').order_by('conditionName')
    dentproc=specialClinicProcedure.objects.all().filter(spDepartment='Dental').order_by('procedureName')
    stores = Store.objects.filter(category='Sub Store')
    context = {       
        'patType':patType,
        'wards':wards,
        'clinics':clinics,
        'dentcond':dentcond,
        'dentproc':dentproc,
        'stores':stores
    } 
    
    return render(request, 'dashboard/consult/consult_dental.html',context)



def waitlist_dental(request):
    if request.method=='POST':
        data=[]
        startdate = datetime.now()     
        enddate = startdate - timedelta(hours=24)
        patient=OpVisits.objects.filter(visit_date__gte=enddate,clinic_name__clinic_name='Dental').order_by('visit_date','visit_time')      
        if patient: 
            
            for i in range(len(patient)):                
                data.append({
                'subname':patient[i].subname.sub_name,
                'pmode':patient[i].subname.scheme_name,
                'pno':patient[i].op_number.op_number,
                'pname':patient[i].op_number.fullname,
                'age':patient[i].op_number.patient_age,
                'gender':patient[i].op_number.gender,             
                'vdate':patient[i].visit_date,             
                'vno':patient[i].visitNo,
                'vtime':patient[i].visit_time.strftime("%I:%M%p")                             
            })
        
        return JsonResponse(data, safe=False)
    

@login_required
def SaveDentalNotes(request):
     if request.method=='POST':
        
        pid=request.POST.get('spid')        
        consNo=request.POST.get('consnumber')
        
        datenow = datetime.now()
        ctime=datenow.time()

        #cname=request.POST.get('sclname')
        cname='Dental'
        
        cons_info=specialConsult.objects.get(cons_reff=consNo,op_number=pid)
        
        cons_info.specialClinic=OpClinics.objects.get(clinic_name=cname)
        cons_info.op_number=PatientBioData.objects.get(op_number=pid)  
        cons_info.complainFindings=request.POST.get('compExFind')
        cons_info.additionNotes=request.POST.get('additionDentalNotes')        
        cons_info.cons_leave_time=ctime           
        cons_info.dentalptype=request.POST.get('denpatcat')
        cons_info.toothselect=request.POST.get('thselect')
        cons_info.condition=specialClinicCondition.objects.get(conditionName=request.POST.get('dencondition'))
        cons_info.procedure=specialClinicProcedure.objects.get(procedureName=request.POST.get('denprocedure'))

        cons_info.save()
        data = {'msg': 'clerking notes saved successfully'}
        return JsonResponse(data, safe=False)


############### theatre booking #####################################

def booktheater(request):
    #list of pending bookings
    services=Services.objects.filter(service_point='theatre').order_by('service_name')
    context={
        'services':services
    }
    return render(request, 'dashboard/consult/consult_booktheater.html',context)


def saveTHBook(request):
     if request.method=='POST':
        card=json.loads(request.body).get('card') 
        bktype=json.loads(request.body).get('bktype')
        procd=json.loads(request.body).get('procd')
        bkdate=json.loads(request.body).get('bkdate')
        addnotes=json.loads(request.body).get('addnotes')
        userId=request.user.id
        
        query=BookTheater()
        query.patient_no=PatientBioData.objects.get(op_number=card)
        query.bookType=bktype
        query.procedure=Services.objects.get(service_name=procd)
        query.schedule_date=bkdate
        query.bookNotes=addnotes
        query.status='pending'
        query.added_by =CustomUser.objects.get(id=userId)

        query.save()
        data={'msg':'Theatre booking saved successfully'}

        return JsonResponse(data, safe=False)
     


def booklist(request):
    if request.method=='POST':
        data=[]
        startdate = datetime.now()     
        enddate = startdate + timedelta(days=14)
        patient=BookTheater.objects.filter(schedule_date__range=[startdate,enddate]).order_by('-book_date')      
        cnt=BookTheater.objects.filter(schedule_date__range=[startdate,enddate]).count()     
        if patient: 
            
            for i in range(len(patient)):                
                data.append({
                'fullname':patient[i].patient_no.fullname,
                'patno':patient[i].patient_no.op_number,
                'bkdate':patient[i].book_date.strftime("%Y-%m-%d(%I:%M%p)"),
                'schdate':patient[i].schedule_date.strftime("%Y-%m-%d"),
                'status':patient[i].status,
                'ttproc':cnt,                           
            })
        
        return JsonResponse(data, safe=False)
            


######################### death notification ###################################

@login_required
def notify_death(request):
    cause=DeathCause.objects.all().order_by('cause')
    rel=relationship.objects.all().order_by('relName') 
    context={
        'death_cause':cause,
        'relation':rel
    }    
    return render(request, 'dashboard/consult/cons_notify_death.html',context)

@login_required
def saveNotification(request):
    if request.method=='POST':
        data={}
        query=DeathNotification()
        query.hospitalNo=request.POST.get('ipop')
        query.deceasedName=request.POST.get('dc_name')
        query.age=request.POST.get('dc_age')
        query.gender=request.POST.get('dc_gender')
        query.broughtByFullname=request.POST.get('dc_bfullname')
        query.broughtByPhone=request.POST.get('dc_bphone')
        query.broughtByIdno=request.POST.get('dc_bidno')
        query.broughtByRelation=request.POST.get('dc_brelation')
        query.nokFullname=request.POST.get('dc_nkfullname')
        query.nokPhone=request.POST.get('dc_nkage')
        query.nokIdno=request.POST.get('dc_nkidno')
        query.nokRelation=request.POST.get('dc_relation')  
        query.cause=DeathCause.objects.get(cause=request.POST.get('dcause'))
        query.place=request.POST.get('pod')
        query.clinicalNotes=request.POST.get('clnotes')
        query.sheetNo=request.POST.get('sheetno')
        query.doctor =User.objects.get(id=request.user.id) 
        query.category=request.POST.get('designation')
        query.policeStaion=request.POST.get('station')
        query.save()
        
        data={'msg':'Notification recorded successfully'}
        return JsonResponse(data, safe=False)