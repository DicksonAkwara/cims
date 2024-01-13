from queue import Empty
from .models import *
from systemusers.models import *
from django.views.generic import ListView
from django.views.generic import View
from django.http import JsonResponse
from django.shortcuts import render

import json
from django.contrib import messages
from datetime import date,datetime, timedelta
from consultation.models import ClinicBook,Admission
from finance.models import *
from reports.models import deptReport
from django.contrib.auth.decorators import login_required

@login_required
def rec_index(request):
    context = {}
    return render(request, 'dashboard/records/rec_index.html', context)


@login_required
def rec_report(request):
    repname=deptReport.objects.filter(departmentName='1').order_by('reportName')
    context = {
        'repname':repname
    }
    return render(request, 'dashboard/records/rec_report.html', context)


@login_required
def rec_upload(request):
    context = {}
    return render(request, 'dashboard/records/rec_upload.html', context)

@login_required
def RecRegister(request):
    # will fetch for the schemes available in database an load them into the payment modal
    # also the available point of service 
    pos=OpClinics.objects.all()
    schemes=Schemes.objects.all()
    county=Residence.objects.all().distinct('county_name')
    relation=relationship.objects.all().order_by('relName')    
    category=PatientCategory.objects.all().order_by('categoryName')
   
    context = {
        'pos':pos,
        'schemes':schemes,
        'county':county,
        'relation':relation,
        'category':category
    }
    
    return render(request, 'dashboard/records/rec_opd_register.html', context)

@login_required
def recRegisterList(request):
    startdate = date.today()
    patList =OpVisits.objects.select_related('op_number','clinic_name','subname','staff').filter(visit_date=startdate).order_by('-visit_time')
    pos=OpClinics.objects.all()
    totalpatients=patList.count()
    context = {
        'pos':pos,
        'patList':patList,
        'count':totalpatients
    }
    
    return render(request, 'dashboard/records/rec_registerlist.html', context)


@login_required
def rec_ipregister(request):
    startdate = date.today()
    patList =IpVisit.objects.filter(admissionDate=startdate).order_by('-admissionTime')
    ward=IpWard.objects.all()
    totalpatients=patList.count()
    rel=relationship.objects.all().order_by('relName')
   
    category=PatientCategory.objects.all().order_by('categoryName') 
    context = {
        'ward':ward,
        'patList':patList,
        'count':totalpatients,
        'relation':rel,
        'category':category
    }
    
    return render(request, 'dashboard/records/rec_ipregister.html', context)

# class RecRegister(ListView):
#    model = PatientBioData
#    template_name = 'dashboard/records/rec_opd_register.html'
#    context_object_name = 'new_patients'


@login_required
def rec_register_patient(request):
    if request.method=='POST':
        patientInfo = PatientBioData()
        opvisit = OpVisits()
        data={}
        datenow = datetime.now()
        year=datenow.strftime('%Y')
        yr=year[2:]
        vtype=''
        last_id=''
        userId=request.user.id
        
        visit_type = request.POST.get('patient_type')        
        
        if visit_type == 'newPatient':
            vtype ='newPatient'
            fname= request.POST.get('fullname')
            patientInfo.fullname = fname
            patientInfo.national_idno = request.POST.get('idno')
            patientInfo.patient_phone = request.POST.get('phone')
            patientInfo.patient_age = request.POST.get('age')
            patientInfo.patient_DOB = request.POST.get('dob')
            patientInfo.gender = request.POST.get('gender')        
            patientInfo.county = request.POST.get('county')
            patientInfo.sub_county = request.POST.get('scounty')
            patientInfo.residence = request.POST.get('residence')
            patientInfo.nok_name = request.POST.get('nokname')
            patientInfo.nok_phone = request.POST.get('nokphone')
            patientInfo.nok_relation = request.POST.get('relation')
            patientInfo.staff =CustomUser.objects.get(id=userId)
            patientInfo.save()

            #last_id = PatientBioData.objects.latest('op_number').op_number
            last_id=patientInfo.pk
            update=PatientBioData.objects.get(op_number=last_id)
            pno=str(last_id)+str('/')+str(yr)
            update.patient_no=pno
            update.save()
            
            
            #data = {'msg': f'[{fname} ]registered successfully]', 'id': last_id}
            data={'msg': f'[{fname} ]registered successfully]', 'id': last_id,'regno':pno}
           

        elif visit_type =='revisit':
            vtype = 'revisit'
            last_id = request.POST.get('editPatno')
            patientInfo = PatientBioData.objects.get(op_number=last_id)

            fname= request.POST.get('fullname')            
            patientInfo.fullname = fname
            patientInfo.national_idno = request.POST.get('idno')
            patientInfo.patient_phone = request.POST.get('phone')
            patientInfo.patient_age = request.POST.get('age')
            patientInfo.patient_DOB = request.POST.get('dob')
            patientInfo.gender = request.POST.get('gender')        
            patientInfo.county = request.POST.get('county')
            patientInfo.sub_county = request.POST.get('scounty')
            patientInfo.residence = request.POST.get('residence')
            patientInfo.nok_name = request.POST.get('nokname')
            patientInfo.nok_phone = request.POST.get('nokphone')
            patientInfo.nok_relation = request.POST.get('relation')
            patientInfo.staff =CustomUser.objects.get(id=userId)
            patientInfo.save()

            pno='OP'+str(last_id)+str('/')+str(yr)
            data={'msg': f'{fname} details updated successfully', 'id': last_id,'regno':pno}
                    

        ## check if already activate

        sql=OpVisits.objects.filter(op_number=last_id,visit_date=datetime.today())
        if sql:
            vvno=0
            data={'msg': f'{fname} visit already exists', 'id': last_id,'vno':vvno}
        else:    
            opvisit.op_number = PatientBioData.objects.get(op_number = last_id) #no last id found
            now=datetime.now().timestamp()
            now_x=hex(int(now))
            invno=now_x[2:]
            pymode=request.POST.get('ppaymode')

            opvisit.visit_type = vtype 
            opvisit.clinic_name = OpClinics.objects.get(clinic_name = request.POST.get('pos'))        
            opvisit.paymode = pymode        
            opvisit.subname = Schemes.objects.get(sub_name = request.POST.get('pscheme'))
            opvisit.memberNo = request.POST.get('mbNumber')
            opvisit.category = PatientCategory.objects.get(categoryName=request.POST.get('pcat'))
            if pymode=='cash':
                opvisit.invoice_no =''
            else:
                opvisit.invoice_no=invno
            
            opvisit.urgency ='Normal'
            opvisit.staff =CustomUser.objects.get(id=userId)
            opvisit.save()
            vno=opvisit.pk

            data['vno']=vno      
            
    return JsonResponse(data, safe=False)


 
@login_required
def search_op_patient(request):
    if request.method == 'POST':
        search_str = json.loads(request.body).get('searchText')
        patient = PatientBioData.objects.filter(patient_no__icontains=search_str).exclude(patient_no__icontains='IP')[0:5] | \
                  PatientBioData.objects.filter(national_idno__icontains=search_str).exclude(patient_no__icontains='IP')[0:5] | \
                  PatientBioData.objects.filter(patient_phone__icontains=search_str).exclude(patient_no__icontains='IP')[0:5] | \
                  PatientBioData.objects.filter(fullname__icontains=search_str).exclude(patient_no__icontains='IP')[0:5]
        data = patient.values()
        return JsonResponse(list(data), safe=False)

def searchInPatient(request):
    search_str = json.loads(request.body).get('searchText')
    patient = PatientBioData.objects.filter(patient_no__icontains=search_str).exclude(patient_no__icontains='OP')[0:5] | \
              PatientBioData.objects.filter(national_idno__icontains=search_str).exclude(patient_no__icontains='OP')[0:5] | \
              PatientBioData.objects.filter(patient_phone__icontains=search_str).exclude(patient_no__icontains='OP')[0:5] | \
              PatientBioData.objects.filter(fullname__icontains=search_str).exclude(patient_no__icontains='OP')[0:5]
    data = patient.values()
    
    return JsonResponse(list(data), safe=False)


def load_sub_counties(request):
    if request.method == 'POST':
        search_str = json.loads(request.body).get('searchText')
        scounty = Residence.objects.filter(county_name=search_str)
        data = scounty.values()
        return JsonResponse(list(data), safe=False)



# def load_op_details(request, id):
#    patient = PatientBioData.objects.get(op_number=id)
#    data = patient.values()
#    return JsonResponse(list(data), safe=False)
# context = {'values': patient}
# if request.method == 'GET':
#   return render(request, 'dashboard/records/rec_opd_register.html', context)

# elif request.method == 'POST':
#    messages.info(request, 'handling post request')
#    return render(request, 'dashboard/records/rec_opd_register.html', context)

def load_op_details(request):
    if request.method == 'POST':
        pat_id = json.loads(request.body).get('pat_id')
        patient = PatientBioData.objects.filter(op_number=pat_id)
        data = patient.values()        
        return JsonResponse(list(data), safe=False)


# start of booking views
@login_required
def rec_clinic_book(request):
    today = date.today()
    pos=OpClinics.objects.all()
    #user=list(User.objects.all().values());
    #print(user)
    clinicList =recClinicBook.objects.select_related('op_number','clinic_name','staff').filter(clinic_date=today).order_by('clinic_name')
    
    context = {
        'pos':pos,
        'clinicList':clinicList        
    }
    return render(request, 'dashboard/records/rec_book_clinic.html', context)

def bk_clinic_search(request):
    if request.method == 'POST':
        search_str = json.loads(request.body).get('searchText')
        patient = PatientBioData.objects.filter(op_number=search_str)
        data = patient.values()
        return JsonResponse(list(data), safe=False)



"""class save_bk_clinic(View):
    def get(self, request):
        pid = request.GET.get('pid', None)
        cname = request.GET.get('cname', None)
        cdate = request.GET.get('cdate', None)
       
        obj = recClinicBook.objects.create(
            op_number=PatientBioData.objects.get(op_number = pid),            
            clinic_name=OpClinics.objects.get(clinic_name = cname),
            clinic_date=cdate           
        )        
        user = {'msg':'Clinic booked successfully'}        
        data = {
            'user': user
        }
        return JsonResponse(data)"""

def savebookClinic(request):
    if request.method=='POST':
        pid=json.loads(request.body).get('pid')
        cname=json.loads(request.body).get('cname')
        cdate=json.loads(request.body).get('cdate')
        act=json.loads(request.body).get('activity')
        reff=json.loads(request.body).get('reff')
        
        if act=='edit':  
            book=recClinicBook.objects.get(reff_number=reff) 
            book.clinic_name=OpClinics.objects.get(clinic_name=cname)           
            book.clinic_date=cdate
            book.staff=CustomUser.objects.get(id=request.user.id)
            book.save()

            data = {'msg': 'clinic date saved successfully'}
        

        elif act=='receive':
            book=recClinicBook()                
            book.op_number=PatientBioData.objects.get(op_number=pid)
            book.clinic_name=OpClinics.objects.get(clinic_name=cname)
            book.clinic_date=cdate
            book.staff=CustomUser.objects.get(id=request.user.id)
            book.save()

            bookInfo=ClinicBook.objects.get(BookReffNo=reff)            
            bookInfo.recStatus='noted'
            bookInfo.save()

            data = {'msg': 'clinic date saved successfully'}

        else:
            #check if clinic already booked
            sql=recClinicBook.objects.filter(op_number=pid,clinic_name__clinic_name=cname,clinic_date=cdate)
            if sql.exists():
                data = {'msg': 'clinic date already booked'}
            else:
                book=recClinicBook()                
                book.op_number=PatientBioData.objects.get(op_number=pid)
                book.clinic_name=OpClinics.objects.get(clinic_name=cname)
                book.staff=CustomUser.objects.get(id=request.user.id)
                book.clinic_date=cdate
                book.save()
                data = {'msg': 'clinic date saved successfully'}

        return JsonResponse(data, safe=False)


def load_all_clinics(request):
    current_date = date.today()
    #sales_line.objects.filter(expected_end_date__gt = current_date) 
    # date range     Sample.objects.filter(date__range=["2011-01-01", "2011-01-31"])     
    clinics = recClinicBook.objects.filter(clinic_date = current_date)
    data = clinics.values()
    return JsonResponse(list(data), safe=False)
    # print(data)




# records billing methods
@login_required
def rec_billing(request):
    patType = PatientType.objects.all()
    context={
        'patType':patType
    }
    return render(request,'dashboard/records/rec_billing.html',context)

@login_required
def bill_pat_search(request):
    if request.method == 'POST':
        startdate = date.today()        
        enddate = startdate - timedelta(days=1)
        search_str = json.loads(request.body).get('searchText')
        patient = list(OpVisits.objects.filter(op_number=search_str,visit_date__range=[enddate,startdate]).values())        
        #print(patient)            
        return JsonResponse(patient, safe=False)


@login_required
def bill_patient_name(request):
    if request.method=='POST':
        search_str = json.loads(request.body).get('searchText')
        patient = list(PatientBioData.objects.filter(op_number=search_str).values())        
        return JsonResponse(patient, safe=False)

@login_required
def bill_service_search(request):
    if request.method == 'POST':        
        search_str = json.loads(request.body).get('searchText')
        svs = Services.objects.filter(service_name__icontains=search_str,service_type='service')[0:5]
        data = svs.values()
        return JsonResponse(list(data), safe=False)
    

@login_required
def bill_cons_search(request):
    if request.method == 'POST':
        svs = Services.objects.filter(service_name__icontains='consultation',service_type='service')
        data = svs.values()
        return JsonResponse(list(data), safe=False)

        #import time
        #currentDate = time.strftime("%Y-%m-%d")
        #print(currentDate)
        # .filter(created_at__range=[from_date, to_date])



class save_bill_old(View):
    def get(self, request):
        pid = request.GET.get('pid', None)
        cname = request.GET.get('cname', None)
        cdate = request.GET.get('cdate', None)
       #insert of for loop
        obj = PatientBill.objects.create(
            op_number=PatientBioData.objects.get(op_number = pid),            
            clinic_name=OpClinics.objects.get(clinic_name = cname),
            clinic_date=cdate           
        )        
                
        data = {
            'msg': 'bill saved successfully'
        }
        return JsonResponse(data,safe=False)


@login_required
def cons_bill_save(request):
    if request.method =='POST':
        pb=json.loads(request.body)     
        for i in range(len(pb)):
            billInfo = PatientBill()
            pym=pb[i]["pymode"]
            billInfo.op_number=PatientBioData.objects.get(op_number = pb[i]["pid"])
            billInfo.paymode=pym
            billInfo.patient_type='Out-Patient'
            billInfo.bill_point=pb[i]["spoint"]
            billInfo.service=Services.objects.get(scode = pb[i]["code"])
            billInfo.quantity=1
            billInfo.total_price=pb[i]["cost"]
            if pym=='cash':
                billInfo.pay_status='billed'
            else:
                billInfo.pay_status='paid'
                billInfo.invoice_status='pending'
            billInfo.visitStatus='open'
            billInfo.status='pending'            
            billInfo.visitNo=OpVisits.objects.get(visitNo=pb[i]["vno"])   
            billInfo.billed_by=CustomUser.objects.get(id=request.user.id)
            billInfo.save()        
        res = {
            'msg': 'success'
        }
        return JsonResponse(res,safe=False)

@login_required
def save_bill(request):
    if request.method =='POST':
        bill=json.loads(request.body)
        pb=bill["bill"] #it is the only main item in the dictionary       
        for i in range(len(pb)):
            billInfo = PatientBill()
            pym=pb[i]["pym"]
            billInfo.op_number=PatientBioData.objects.get(op_number = pb[i]["op_no"])
            billInfo.paymode=pym
            billInfo.patient_type=pb[i]["ptype"]
            billInfo.bill_point=pb[i]["dpt"]
            billInfo.service=Services.objects.get(scode = pb[i]["code"])
            billInfo.quantity=pb[i]["qnty"]
            billInfo.total_price=pb[i]["cost"]
            if pym=='cash':
                billInfo.pay_status='billed'
            else:
                billInfo.pay_status='paid'
                billInfo.invoice_status='pending'
            billInfo.visitStatus='open'
            billInfo.status='pending'  
            if pb[i]['ptype']=='In-Patient':
                billInfo.visitNoIp=IpVisit.objects.get(visitId=pb[i]["vno"])
                billInfo.pay_status='billed'
            else:    
                billInfo.visitNo=OpVisits.objects.get(visitNo=pb[i]["vno"])  

            billInfo.billed_by=CustomUser.objects.get(id=request.user.id)
            billInfo.save()        
        res = {
            'msg': 'client bill saved successfully'
        }
        return JsonResponse(res,safe=False)


@login_required
def filterClinicVisit(request):
    if request.method=='POST':
        cname=json.loads(request.body).get('searchText')
        startdate=json.loads(request.body).get('fdate')
        enddate=json.loads(request.body).get('tdate')
        sql=''
        if cname=='all':
            sql=OpVisits.objects.filter(visit_date__range=[startdate,enddate]).order_by('-visit_time')
        else:
            sql=OpVisits.objects.filter(visit_date__range=[startdate,enddate],clinic_name__clinic_name=cname).order_by('-visit_time')

        
        data=[]        
        for i in range(len(sql)):            
            data.append({
                'visit_date':sql[i].visit_date,
                'visit_time':sql[i].visit_time.strftime('%H:%M'),
                'op_number':sql[i].op_number.op_number,                
                'fullname':sql[i].op_number.fullname,
                'patient_age':sql[i].op_number.patient_age,
                'gender':sql[i].op_number.gender,
                'sub_name':sql[i].subname.sub_name,
                'visit_type':sql[i].visit_type,
                'clinic_name':sql[i].clinic_name.clinic_name,
                'username':sql[i].staff.username
            })       
        return JsonResponse(data,safe=False)
@login_required
def filterwardVisit(request):
    if request.method=='POST':
        cname=json.loads(request.body).get('searchText')
        startdate=json.loads(request.body).get('fdate')
        enddate=json.loads(request.body).get('tdate')
        sql=''
        if cname=='all':
            sql=IpVisit.objects.filter(admissionDate__range=[startdate,enddate]).order_by('-admissionTime')
        else:
            sql=IpVisit.objects.filter(admissionDate__range=[startdate,enddate],wardName=cname).order_by('-admissionTime')

        
        data=[]        
        for i in range(len(sql)):            
            data.append({
                'visit_date':sql[i].admissionDate,
                'visit_time':sql[i].admissionTime.strftime('%H:%M'),
                'op_number':sql[i].ipNumber.op_number,                
                'fullname':sql[i].ipNumber.fullname,
                'patient_age':sql[i].ipNumber.patient_age,
                'gender':sql[i].ipNumber.gender,
                'sub_name':sql[i].subname.sub_name,
                'visit_type':sql[i].visitType,
                'clinic_name':sql[i].wardName.wardName,
                'username':sql[i].admittedBy.username
            })       
        return JsonResponse(data,safe=False)




@login_required
def clinicCategory(request):
    if request.method=='POST':
        cat=json.loads(request.body).get('searchText')
        today = date.today()
        data=[] 
        sql=''        
        if cat=='today':
            sql=recClinicBook.objects.select_related('op_number','clinic_name','staff').filter(clinic_date=today).order_by('clinic_name')
        
        elif cat=='Pending':
            sql=recClinicBook.objects.select_related('op_number','clinic_name').filter(clinic_date__gte=today).order_by('clinic_name')

        elif cat=='Prescribed':
            sql2=ClinicBook.objects.select_related('cardNo','bookClinic','doctor').filter(bookDate__gte=today,recStatus='pending').order_by('bookClinic')
            for i in range(len(sql2)):
                data.append({
                    'reff':sql2[i].BookReffNo,               
                    'bookDate':sql2[i].bookDate,               
                    'cardNo':sql2[i].cardNo.op_number,                
                    'fullname':sql2[i].cardNo.fullname,
                    'age':sql2[i].cardNo.patient_age,
                    'gender':sql2[i].cardNo.gender,                
                    'phone':sql2[i].cardNo.patient_phone,                
                    'clname':sql2[i].bookClinic.clinic_name,                   
                    'staff':sql2[i].doctor.username
                }) 
            #break  

        for i in range(len(sql)):
            data.append({
                'reff':sql[i].reff_number,
                'clinic_date':sql[i].clinic_date,               
                'op_number':sql[i].op_number.op_number,                
                'fullname':sql[i].op_number.fullname,
                'age':sql[i].op_number.patient_age,
                'gender':sql[i].op_number.gender,
                'phone':sql[i].op_number.patient_phone,                
                'clinic_name':sql[i].clinic_name.clinic_name,
                'staff':sql[i].staff.username
            }) 
             
        return JsonResponse(data,safe=False)


def split_value(request):
    search_str = json.loads(request.body).get('searchText')
    patient = list(PatientBioData.objects.filter(op_number=search_str).values('fullname'))  
   # print(patient)      
    return JsonResponse(patient, safe=False)


#################ip registration###################################

@login_required
def registerInpatient(request):
    # will fetch for the schemes available in database an load them into the payment modal
    # also the available point of service 
    pos=IpWard.objects.all().order_by('wardName')
    schemes=Schemes.objects.all()
    county=Residence.objects.all().distinct('county_name').order_by('county_name')
    category=PatientCategory.objects.all().order_by('categoryName') 
    rel=relationship.objects.all().order_by('relName')
    
    context = {
        'pos':pos,
        'schemes':schemes,
        'county':county,
        'category':category,
        'relation':rel,
    }
    
    return render(request, 'dashboard/records/register_inpatient.html', context)


def registerIp(request):
    if request.method=='POST':
        #patientInfo = PatientBioData()        
        ## if no outpatient number registter but if exist just record the visit
        """ datenow = datetime.now()
        cdate = datenow.date()
        ctime=datenow.time() """

        #vtype=''
        #last_id=0
        last_id = request.POST.get('editPatno')
        fname= request.POST.get('fullname')
        
        #visit_type = request.POST.get('pptype')        
        """ 
        if visit_type == 'newAdm':
            vtype ='newAdm'
            fname= request.POST.get('fullname')
            patientInfo.fullname = fname
            patientInfo.national_idno = request.POST.get('idno')
            patientInfo.patient_phone = request.POST.get('phone')
            patientInfo.patient_age = request.POST.get('age')
            patientInfo.patient_DOB = request.POST.get('dob')
            patientInfo.gender = request.POST.get('gender')        
            patientInfo.county = request.POST.get('county')
            patientInfo.sub_county = request.POST.get('scounty')
            patientInfo.residence = request.POST.get('residence')
            patientInfo.nok_name = request.POST.get('nokname')
            patientInfo.nok_phone = request.POST.get('nokphone')
            patientInfo.relationship = request.POST.get('relation')            
            patientInfo.staff=CustomUser.objects.get(id=request.user.id)           
            patientInfo.save()
            last_id=patientInfo.pk
            #last_id = PatientBioData.objects.latest('op_number').op_number
            
            #data = {'msg': f'Patient [{fname} ]admitted successfully.Card No:[ {last_id} ]', 'id': last_id}

        elif visit_type =='readm':
            vtype = 'readm'
            last_id = request.POST.get('editPatno')
            patientInfo = PatientBioData.objects.get(op_number=last_id)

            fname= request.POST.get('fullname')            
            patientInfo.fullname = fname
            patientInfo.national_idno = request.POST.get('idno')
            patientInfo.patient_phone = request.POST.get('phone')
            patientInfo.patient_age = request.POST.get('age')
            patientInfo.patient_DOB = request.POST.get('dob')
            patientInfo.gender = request.POST.get('gender')        
            patientInfo.county = request.POST.get('county')
            patientInfo.sub_county = request.POST.get('scounty')
            patientInfo.residence = request.POST.get('residence')
            patientInfo.nok_name = request.POST.get('nokname')
            patientInfo.nok_phone = request.POST.get('nokphone')
            patientInfo.relationship = request.POST.get('relation')
            patientInfo.staff =CustomUser.objects.get(id=request.user.id)
            patientInfo.save()

            data = {'msg': f'Patient [{fname} ]details updated successfully. card no:[{last_id}]', 'id': last_id}

         """          

        visitSearch = IpVisit.objects.filter(ipNumber = last_id,admStatus='active') #check if already admitted
        
        if not visitSearch.exists():
            #update details then visit

            patientInfo = PatientBioData.objects.get(op_number=last_id)                        
            patientInfo.fullname = fname
            patientInfo.national_idno = request.POST.get('idno')
            patientInfo.patient_phone = request.POST.get('phone')
            patientInfo.patient_age = request.POST.get('age')
            patientInfo.patient_DOB = request.POST.get('dob')
            patientInfo.gender = request.POST.get('gender')        
            patientInfo.county = request.POST.get('county')
            patientInfo.sub_county = request.POST.get('scounty')
            patientInfo.residence = request.POST.get('residence')
            patientInfo.nok_name = request.POST.get('nokname')
            patientInfo.nok_phone = request.POST.get('nokphone')
            patientInfo.nok_relation = request.POST.get('relation')
            patientInfo.staff =CustomUser.objects.get(id=request.user.id)
            patientInfo.save()



            ipvisit = IpVisit()
            ipvisit.visitType = 'new admission' 
            ipvisit.ipNumber = PatientBioData.objects.get(op_number = last_id)
            ipvisit.wardName = IpWard.objects.get(wardName = request.POST.get('wname'))
            ipvisit.paymode = request.POST.get('ppaymode')        
            ipvisit.subname = Schemes.objects.get(sub_name = request.POST.get('pscheme'))
            ipvisit.memberNo = request.POST.get('mbNumber')
            ipvisit.fileNumber = request.POST.get('mfilenumber')
            ipvisit.admissionType = request.POST.get('admType')
            ipvisit.patientCategory = request.POST.get('pcat')
            ipvisit.admStatus = 'active'
            ipvisit.admittedBy =CustomUser.objects.get(id=request.user.id)
            ipvisit.save()
            
            data = {'msg': f'Patient [{fname} ] admitted successfully ipcard no:[{last_id}]', 'id': last_id}
            
        
        else:
            data = {'msg': f'Patient [{fname} ]already admitted card no:[{last_id}]', 'id': last_id}
           
              
            
    return JsonResponse(data)


############change patient pay mode###########################
@login_required
def recChangeMode(request):    
    schemes=Schemes.objects.all()   
    context = {
        'schemes':schemes       
    }    
    return render(request, 'dashboard/records/recPaymode.html', context)

def changePaymode(request):
    if request.method=='POST':
        visitid=json.loads(request.body).get('vno')
        pid=json.loads(request.body).get('pid')
        pmode=json.loads(request.body).get('pmode')
        scname=json.loads(request.body).get('scname')
        no=json.loads(request.body).get('no')

        change=OpVisits.objects.get(visitNo=visitid,op_number=pid) 
        change.paymode=pmode           
        change.subname = Schemes.objects.get(sub_name = scname)
        change.memberNo = no
        change.save()

    data = {'res': 'payment mode changed successfully'}
    return JsonResponse(data,safe=False)

##############mch and fp opeations ####################
@login_required
def mchindex(request):      
    context = {}    
    return render(request, 'dashboard/records/mch_index.html', context)

@login_required
def mchregistration(request):
    mch=mchClinic.objects.all()   
    scheme=Schemes.objects.all() 
    county=Residence.objects.all().distinct('county_name')
    context = {
        'clinics':mch,
        'schemes':scheme,
        'county':county     
    }    
    return render(request, 'dashboard/records/mchregister.html', context)

@login_required
def mchRegisterPatient(request):
    if request.method=='POST':        
        patientInfo = PatientBioData()
        opvisit = OpVisits()

        datenow = datetime.now()
        cdate = datenow.date()
        ctime=datenow.time()

        vtype=''
        last_id=''
        
        visit_type = request.POST.get('patient_type')        
        
        if visit_type == 'newPatient':
            vtype ='newPatient'
            fname= request.POST.get('fullname')
            patientInfo.fullname = fname
            patientInfo.national_idno = request.POST.get('idno')
            patientInfo.patient_phone = request.POST.get('phone')
            patientInfo.patient_age = request.POST.get('age')
            patientInfo.patient_DOB = request.POST.get('dob')
            patientInfo.gender = request.POST.get('gender')        
            patientInfo.county = request.POST.get('county')
            patientInfo.sub_county = request.POST.get('scounty')
            patientInfo.residence = request.POST.get('residence')
            patientInfo.nok_name = request.POST.get('nokname')
            patientInfo.nok_phone = request.POST.get('nokphone')
            patientInfo.relationship = request.POST.get('relation')
            patientInfo.staff =CustomUser.objects.get(id=request.user.id)
            patientInfo.save()

            #last_id = PatientBioData.objects.latest('op_number').op_number
            last_id =patientInfo.pk
            
            data = {'msg': f'Patient [{fname} ]registered successfully.Card No:[ {last_id} ]', 'id': last_id}
           

        elif visit_type =='revisit':
            vtype = 'revisit'
            last_id = request.POST.get('editPatno')
            patientInfo = PatientBioData.objects.get(op_number=last_id)

            fname= request.POST.get('fullname')            
            patientInfo.fullname = fname
            patientInfo.national_idno = request.POST.get('idno')
            patientInfo.patient_phone = request.POST.get('phone')
            patientInfo.patient_age = request.POST.get('age')
            patientInfo.patient_DOB = request.POST.get('dob')
            patientInfo.gender = request.POST.get('gender')        
            patientInfo.county = request.POST.get('county')
            patientInfo.sub_county = request.POST.get('scounty')
            patientInfo.residence = request.POST.get('residence')
            patientInfo.nok_name = request.POST.get('nokname')
            patientInfo.nok_phone = request.POST.get('nokphone')
            patientInfo.relationship = request.POST.get('relation')
            patientInfo.staff =CustomUser.objects.get(id=request.user.id)
            patientInfo.save()

            data = {'msg': f'Patient [{fname} ]details updated successfully. card no:[{last_id}]', 'id': last_id}
                    

        opvisit.op_number = PatientBioData.objects.get(op_number = last_id) #no last id found
        
        opvisit.visit_type = vtype 
        opvisit.mchClinicName = mchClinic.objects.get(clinicName = request.POST.get('pos'))
        opvisit.paymode = request.POST.get('ppaymode')        
        opvisit.subname = Schemes.objects.get(sub_name = request.POST.get('pscheme'))
        opvisit.memberNo = request.POST.get('mbNumber')
        opvisit.visit_date =cdate 
        opvisit.visit_time =ctime
        opvisit.staff =CustomUser.objects.get(id=request.user.id)
        opvisit.save()        
            
    return JsonResponse(data, safe=False)

@login_required
def maidensearch(request):
    if request.method == 'POST':        
        search_str = json.loads(request.body).get('searchText')
        patient = list(PatientBioData.objects.filter(op_number=search_str).values('fullname'))        
                    
        return JsonResponse(patient, safe=False)

@login_required
def savebabyprofile(request):
    if request.method=='POST':        
        prof=pncbaby()
        prof.maidenNumber=PatientBioData.objects.get(op_number=request.POST.get('mdcardNo'))
        prof.babyname=request.POST.get('bbname')
        prof.Dateofbirth=request.POST.get('bdob')
        prof.placeofbirth= request.POST.get('bbplace')                    
        prof.gender= request.POST.get('bbsex') 
        prof.recoredby=CustomUser.objects.get(id=request.user.id)                
        prof.save()            
        data = {'msg': f'saved successfully'}           
        
    return JsonResponse(data,safe=False)


@login_required
def rec_pat_file(request):
    patType = PatientType.objects.all()
    context={
        'patType':patType
    }
    return render(request, 'dashboard/records/rec_patientfile.html', context)


from .forms import PDFUploadForm
@login_required
def uploadoc(request):
    if request.method=='POST':
        form=PDFUploadForm(request.POST,request.FILES)
        if form.is_valid():
            pno=form.cleaned_data.get('pno')
            pdf_files=form.cleaned_data.get('pdf_files')
            for pdf in pdf_files:
                #save in folter and db
                print(pno)
                pass
            return JsonResponse({'success':True})
        else:
            return JsonResponse({'success':False,'errors':form.errors})

@login_required
def adm_request(request):
    sql=Admission.objects.filter(requestDate=datetime.today(),status='pending').order_by('requestDate','requestTime')
    data=[]
    for i in range(len(sql)):
        data.append({
            'rqid':sql[i].admReffNo,
            'rqdate':sql[i].requestDate,
            'rqtime':sql[i].requestTime,
            'pno':sql[i].op_number.op_number,
            'pname':sql[i].op_number.fullname,
            'gend':sql[i].op_number.gender,
            'age':sql[i].op_number.patient_age,
            'doc':sql[i].doctor.username,
            'ward':sql[i].ward.wardName,
        })          
        
    return JsonResponse(data,safe=False)

@login_required
def adm_request_date(request):
    import datetime
    if request.method=='POST':
        reqdate=json.loads(request.body).get('reqdate')
        fdate = datetime.datetime.strptime(reqdate, '%Y-%m-%d')
        sql=Admission.objects.filter(requestDate__gte=fdate,status='pending').order_by('requestDate','requestTime')
        data=[]
        for i in range(len(sql)):
            data.append({
                'rqid':sql[i].admReffNo,
                'rqdate':sql[i].requestDate,
                'rqtime':sql[i].requestTime.strftime('%H:%M'),
                'pno':sql[i].op_number.op_number,
                'pname':sql[i].op_number.fullname,
                'gend':sql[i].op_number.gender,
                'age':sql[i].op_number.patient_age,
                'doc':sql[i].doctor.username,
                'ward':sql[i].ward.wardName,
            })
        return JsonResponse(data,safe=False)
    