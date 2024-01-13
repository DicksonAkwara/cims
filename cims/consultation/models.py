from django.db import models
from systemusers.models import CustomUser as user
from MedicalRecords.models import *
from stores.models import *
from datetime import datetime

class Disease(models.Model):
    disease_code = models.AutoField(primary_key=True)
    disease_name= models.CharField(max_length=150, null= True)
""" 
    def __str__(self):
        return f'{self.disease_name}' """

class Consultation(models.Model):
    cons_reff = models.AutoField(primary_key=True)
    clinicName = models.ForeignKey( OpClinics, on_delete=models.DO_NOTHING, null=True)
    wardName = models.ForeignKey( IpWard, on_delete=models.DO_NOTHING, null=True)
    cons_date = models.DateTimeField(auto_now_add=True)
    cons_receive_time = models.TimeField(auto_now_add=True)    
    op_number = models.ForeignKey(PatientBioData,on_delete=models.DO_NOTHING, null=True)
    chief_complain = models.CharField(max_length=250, null=True)
    doctor_notes = models.CharField(max_length=250, null=True)
    hist_doctor_notes = models.CharField(max_length=250, null=True)
    continuation_notes = models.CharField(max_length=250, null=True)
    provisional_diagnosis = models.ForeignKey(Disease,related_name='provisional', on_delete=models.DO_NOTHING, null=True)    
    confirmed_diagnosis = models.ForeignKey(Disease,related_name='confirmed', on_delete=models.DO_NOTHING, null=True)    
    service = models.CharField(max_length=250, null=True)
    visit_status = models.CharField(max_length=50, null=True)
    #cons_leave_time=models.TimeField(default=datetime.time(datetime.now()))
    cons_leave_date=models.DateTimeField(null=True)
    cons_leave_time=models.TimeField(null=True)
    visit_no_op=models.ForeignKey(OpVisits,on_delete=models.DO_NOTHING, null=True)
    visit_no_ip=models.ForeignKey(IpVisit,on_delete=models.DO_NOTHING, null=True)
    doctor = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)


class Prescription(models.Model):
    prescNo = models.AutoField(primary_key=True)
    prescription_tag = models.CharField(max_length=100, null=True)
    prescDate = models.DateField(auto_now_add=True)
    prescTime = models.TimeField(auto_now_add=True)  
    opNumber= models.ForeignKey(PatientBioData,on_delete=models.DO_NOTHING, null=True)
    visitOp= models.ForeignKey(OpVisits,on_delete=models.DO_NOTHING, null=True)
    visitIp= models.ForeignKey(IpVisit,on_delete=models.DO_NOTHING, null=True)
    itemCode = models.ForeignKey(DrugGeneralItem, on_delete=models.DO_NOTHING, null=True) 
    storeId = models.ForeignKey(Store, on_delete=models.DO_NOTHING, null=True) 
    dosage = models.CharField(max_length=50, null=True)
    frequency = models.CharField(max_length=50, null=True)
    days = models.CharField(max_length=50, null=True)
    quantity = models.FloatField(null=True)
    price = models.FloatField(null=True)
    status = models.CharField(max_length=100, null=True)  
    doctor = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)

class ServiceRequest(models.Model):
    requestNo = models.AutoField(primary_key=True)
    reqDate = models.DateField(auto_now_add=True)
    reqTime = models.TimeField(auto_now_add=True)  
    opNumber= models.ForeignKey(PatientBioData,on_delete=models.DO_NOTHING, null=True)
    serviceCode = models.ForeignKey(Services, on_delete=models.DO_NOTHING, null=True) 
    paymode = models.ForeignKey(Schemes, on_delete=models.DO_NOTHING, null=True)
    quantity = models.IntegerField(null=True)
    urgency = models.CharField(max_length=100, null=True)
    status = models.CharField(max_length=100, null=True)
    doctor = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)


class Admission(models.Model):
    admReffNo = models.AutoField(primary_key=True)
    requestDate = models.DateField(auto_now_add=True)
    requestTime = models.TimeField(auto_now_add=True)    
    op_number = models.ForeignKey(PatientBioData,on_delete=models.DO_NOTHING, null=True)
    doctor_notes = models.CharField(max_length=250, null=True)
    ward = models.ForeignKey(IpWard,on_delete=models.DO_NOTHING, null=True)
    doctor = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)
    status = models.CharField(max_length=20, null=True)


    def __str__(self):
        return f'{self.op_number.fullname}({self.op_number.op_number})'

class ClinicBook(models.Model):
    BookReffNo = models.AutoField(primary_key=True)
    requestDate = models.DateField(auto_now_add=True)
    requestTime = models.TimeField(auto_now_add=True)    
    cardNo = models.ForeignKey(PatientBioData,on_delete=models.DO_NOTHING, null=True)
    bookDate = models.DateField(null=True)
    bookType = models.CharField(max_length=50, null=True)
    bookClinic = models.ForeignKey(OpClinics,on_delete=models.DO_NOTHING, null=True)
    bookNotes = models.CharField(max_length=250, null=True)
    recStatus = models.CharField(max_length=100, null=True)
    doctor = models.ForeignKey(user, related_name='doctor', on_delete=models.DO_NOTHING, null=True)
    record_by = models.ForeignKey(user,related_name='records_staff', on_delete=models.DO_NOTHING, null=True)

    def __str__(self):
        return f'{self.cardNo.fullname}-{self.bookClinic}({self.bookDate})'

class patientReferral(models.Model):
    ReffNo = models.AutoField(primary_key=True)
    requestDate = models.DateField(auto_now_add=True)
    referralTime = models.TimeField(auto_now_add=True)    
    cardNo = models.ForeignKey(PatientBioData,on_delete=models.DO_NOTHING, null=True)
    referralType = models.CharField(max_length=50, null=True)
    referralNotes = models.CharField(max_length=250, null=True)
    referralFrom = models.ForeignKey(OpClinics,related_name='rffrom', on_delete=models.DO_NOTHING, null=True)
    referralToINT = models.ForeignKey(OpClinics,related_name='tfto',on_delete=models.DO_NOTHING, null=True)
    referralToExt = models.ForeignKey(referalFacility,on_delete=models.DO_NOTHING, null=True)
    doctor = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)

    def __str__(self):
        return f'{self.cardNo.fullname}'


class famPlanMethod(models.Model):
    fpnumber = models.AutoField(primary_key=True)
    acronym =models.CharField(max_length=100, null=True)
    description = models.CharField(max_length=150, null=True)    
    addedby = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)

    def __str__(self):
        return f'{self.description}({self.acronym})'


Period = (
    ('Birth', 'Birth'),
    ('6 weeks', '6 weeks'),
    ('10 weeks', '10 weeks'),    
    ('14 weeks', '14 weeks'),
    ('6 months', '6 months'),
    ('9 months', '9 months'),
    ('18 months', '18 months'),
)
BodyPart= (
    ('intra-dermal left forearm', 'intra-dermal left forearm'),
    ('mouth', 'mouth'),
    ('intra-muscular outer aspect right thigh(2 fingers apart from PCV10 site)', 'intra-muscular outer aspect right thigh(2 fingers apart from PCV10 site)'),
    ('intra-muscular left outer thigh', 'intra-muscular left outer thigh'),
    ('intra-muscular upper outeraspect right thigh', 'intra-muscular upper outeraspect right thigh'),
    ('deep subcutaneous upper right arm deltoid muscle', 'deep subcutaneous upper right arm deltoid muscle'),
    ('intra-muscular left upper deltoid', 'intra-muscular left upper deltoid'),
    
)
method= (
    ('oral', 'oral'),
    ('injection', 'injection'),  
)


class immuneVaccine(models.Model):
    vaccineId = models.AutoField(primary_key=True)
    vaccineName =models.CharField(max_length=100, null=True)
    acronym =models.CharField(max_length=100, null=True)
    apllicationMethod = models.CharField(choices=method,max_length=20, null=True)    
    bodyPart = models.CharField(choices=BodyPart,max_length=200, null=True)    
    vaccinePeriod = models.CharField(choices=Period,max_length=50, null=True)    
    addedby = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)

    def __str__(self):
        return f'{self.vaccineName}({self.acronym})'

class babyVaccine(models.Model):
    immunizationId = models.AutoField(primary_key=True)
    vaccineDate = models.DateField(auto_now_add=True)
    vaccineName =models.ForeignKey(immuneVaccine, on_delete=models.DO_NOTHING, null=True)
    babyNo =models.ForeignKey(pncbaby, on_delete=models.DO_NOTHING, null=True)
    maidenNo =models.ForeignKey(PatientBioData, on_delete=models.DO_NOTHING, null=True)     
    vaccinePeriod = models.CharField(max_length=50, null=True)       
    nextDate =  models.DateField(null=True)      
    addedby = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)

class vaccineComplain(models.Model):
    complainId = models.AutoField(primary_key=True)
    complainDate = models.DateField(auto_now_add=True)    
    babyNo =models.ForeignKey(pncbaby, on_delete=models.DO_NOTHING, null=True)
    maidenNo =models.ForeignKey(PatientBioData, on_delete=models.DO_NOTHING, null=True)
    vaccineName =models.ForeignKey(immuneVaccine, on_delete=models.DO_NOTHING, null=True)
    manufacturer= models.CharField(max_length=200, null=True)         
    manufactureDate =  models.DateField(null=True)      
    expiryDate =  models.DateField(null=True)
    complainDescription = models.CharField(max_length=250, null=True)       
    addedby = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)


class pncVisit(models.Model):
    visitId = models.AutoField(primary_key=True)
    cardNumber = models.ForeignKey(PatientBioData, on_delete=models.DO_NOTHING, null=True)    
    visitDate = models.DateField(auto_now_add=True)
    visitperiod=models.CharField(max_length=50, null=True)    
    bloodPress= models.CharField(max_length=50, null=True)
    pulseRate= models.CharField(max_length=50, null=True)
    temperature= models.CharField(max_length=20, null=True)
    weight= models.CharField(max_length=20, null=True)
    generalExam= models.CharField(max_length=200, null=True)
    breast= models.CharField(max_length=100, null=True)
    csScar= models.CharField(max_length=100, null=True)
    uterusInvolution= models.CharField(max_length=100, null=True)
    pelvicExam= models.CharField(max_length=200, null=True)
    episiotomy= models.CharField(max_length=100, null=True)
    fistula= models.CharField(max_length=100, null=True)
    lochia= models.CharField(max_length=50, null=True)
    hivStatus= models.CharField(max_length=20, null=True)
    counseling= models.CharField(max_length=50, null=True)
    fpMethod= models.CharField(max_length=100, null=True)
    fpSpec= models.CharField(max_length=100, null=True)
    clinicalNotes= models.CharField(max_length=250, null=True)
    nextVisit = models.DateField(null=True)
    recordBy = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)

class pncBabyVisit(models.Model):
    visitId = models.AutoField(primary_key=True)
    cardNumber = models.ForeignKey(PatientBioData, on_delete=models.DO_NOTHING, null=True)
    babyNo = models.ForeignKey(pncbaby, on_delete=models.DO_NOTHING, null=True)
    visitperiod=models.CharField(max_length=50, null=True)
    visitDate = models.DateField(auto_now_add=True)        
    generalExam= models.CharField(max_length=250, null=True)
    temperature= models.CharField(max_length=50, null=True)
    pulserate= models.CharField(max_length=50, null=True)
    weight= models.CharField(max_length=50, null=True)
    feedMethod= models.CharField(max_length=100, null=True)
    breastFeed= models.CharField(max_length=100, null=True)
    umbilicalCord= models.CharField(max_length=100, null=True)
    nextVisit = models.DateField(null=True)
    clinicalNotes= models.CharField(max_length=250, null=True)    
    recordBy = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)

class familyPlan(models.Model):
    fpId = models.AutoField(primary_key=True)
    cardNumber = models.ForeignKey(PatientBioData, on_delete=models.DO_NOTHING, null=True)
    fpno = models.CharField(max_length=50, null=True)
    fpmethod=models.ForeignKey(famPlanMethod, on_delete=models.DO_NOTHING, null=True)
    adminDate = models.DateField(auto_now_add=True) 
    endDate = models.DateField(auto_now_add=True)       
    quantity= models.CharField(max_length=20, null=True)
    status= models.CharField(max_length=20, null=True)
    discReason= models.CharField(max_length=100, null=True)
    recordBy = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)

class familyPlanComplain(models.Model):
    complainId = models.AutoField(primary_key=True)
    complainDate = models.DateField(auto_now_add=True)    
    fpid =models.ForeignKey(familyPlan, on_delete=models.DO_NOTHING, null=True)
    cardnumber =models.ForeignKey(PatientBioData, on_delete=models.DO_NOTHING, null=True)
    fpmethod=models.ForeignKey(famPlanMethod, on_delete=models.DO_NOTHING, null=True)
    batchno= models.CharField(max_length=50, null=True)         
    manufacturer= models.CharField(max_length=200, null=True)         
    manufactureDate =  models.DateField(null=True)      
    expiryDate =  models.DateField(null=True)
    complainDescription = models.CharField(max_length=250, null=True)       
    recordBy = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)

spdept= (
    ('Eye', 'Eye'),
    ('Dental', 'Dental'),  
    ('GBV', 'GBV'),  
)

class specialClinicCondition(models.Model):
    conditionId = models.AutoField(primary_key=True)
    dateAdded = models.DateField(auto_now_add=True) 
    spDepartment=models.CharField(choices=spdept,max_length=50, null=True)
    conditionName = models.CharField(max_length=100, null=True)
    conditionDesc = models.CharField(max_length=100, null=True)
    recordBy = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True) 

    def __str__(self):
        return f'{self.conditionName}({self.conditionId})'

class specialClinicProcedure(models.Model):
    procedureId = models.AutoField(primary_key=True)
    dateAdded = models.DateField(auto_now_add=True) 
    spDepartment=models.CharField(choices=spdept,max_length=50, null=True)
    procedureName = models.CharField(max_length=100, null=True)
    procedureDesc = models.CharField(max_length=100, null=True)
    recordBy = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True) 
    def __str__(self):
        return f'{self.procedureName}({self.procedureId})' 



class specialConsult(models.Model):
    cons_reff = models.AutoField(primary_key=True)
    specialClinic = models.ForeignKey( OpClinics, on_delete=models.DO_NOTHING, null=True)
    cons_date = models.DateTimeField(auto_now_add=True)
    cons_receive_time = models.TimeField(auto_now_add=True)    
    op_number = models.ForeignKey(PatientBioData,on_delete=models.DO_NOTHING, null=True)    
    complainFindings = models.CharField(max_length=250, null=True)
    condition = models.ForeignKey(specialClinicCondition, on_delete=models.DO_NOTHING, null=True)    
    procedure = models.ForeignKey(specialClinicProcedure, on_delete=models.DO_NOTHING, null=True)    
    acuityleft = models.CharField(max_length=20, null=True)    
    acuityright = models.CharField(max_length=20, null=True)
    eyepartselect = models.CharField(max_length=100, null=True)    
    dentalptype = models.CharField(max_length=20, null=True)
    toothselect = models.CharField(max_length=100, null=True)
    additionNotes = models.CharField(max_length=250, null=True)
    cons_leave_date=models.DateTimeField(null=True)
    cons_leave_time=models.TimeField(null=True)
    service = models.CharField(max_length=250, null=True)
    doctor = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)



bktype= (
    ('Elective', 'Elective'),
    ('Emergency', 'Emergency'), 
)


class BookTheater(models.Model):
    reffno = models.AutoField(primary_key=True)
    patient_no = models.ForeignKey(PatientBioData,on_delete=models.DO_NOTHING, null=True) 
    bookType = models.CharField(max_length=20,choices=bktype, null=True)
    procedure = models.ForeignKey(Services,on_delete=models.DO_NOTHING, null=True)
    book_date = models.DateTimeField(auto_now_add=True)
    schedule_date = models.DateTimeField(null=True)
    bookNotes = models.CharField(max_length=250, null=True)
    status = models.CharField(max_length=20, null=True)
    added_by = models.ForeignKey(user, related_name='bkaddedby',on_delete=models.DO_NOTHING, null=True)
    received_by = models.ForeignKey(user, related_name="bkreceivedby",on_delete=models.DO_NOTHING, null=True)
    receive_date = models.DateTimeField(null=True)
    theaterName = models.CharField(max_length=50, null=True)


############### cause of death #########################

class DeathCause(models.Model):
    causeId = models.AutoField(primary_key=True)
    dateAdded = models.DateField(auto_now_add=True)
    cause = models.CharField(max_length=100, null=True)
    recordBy = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True) 
    def __str__(self):
        return f'{self.cause}'

class DeathNotification(models.Model):
    notificationId = models.AutoField(primary_key=True)
    dateAdded = models.DateField(auto_now_add=True)
    hospitalNo=models.CharField(max_length=100, null=True)
    deceasedName=models.CharField(max_length=200, null=True)
    age=models.CharField(max_length=10, null=True)
    gender=models.CharField(max_length=20, null=True)
    broughtByFullname=models.CharField(max_length=100, null=True)
    broughtByPhone=models.CharField(max_length=100, null=True)
    broughtByIdno=models.CharField(max_length=100, null=True)
    broughtByRelation=models.CharField(max_length=100, null=True)
    nokFullname=models.CharField(max_length=100, null=True)
    nokPhone=models.CharField(max_length=100, null=True)
    nokIdno=models.CharField(max_length=100, null=True)
    nokRelation=models.CharField(max_length=100, null=True)    
    cause = models.ForeignKey(DeathCause,on_delete=models.DO_NOTHING,null=True)
    place=models.CharField(max_length=30, null=True)
    clinicalNotes=models.CharField(max_length=250, null=True)
    sheetNo=models.CharField(max_length=30, null=True)
    doctor = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True) 
    category=models.CharField(max_length=30, null=True)
    policeStaion=models.CharField(max_length=50, null=True)
    
    def __str__(self):
        return f'{self.deceasedName} recorded by {self.doctor}'
    
age_cat=(
    ('below 5','below 5'),
    ('above 5','above 5'),
    ('both','both'),
)
class TbIndicators(models.Model):
    id = models.AutoField(primary_key=True)
    dateAdded = models.DateField(auto_now_add=True)
    indicator = models.CharField(max_length=100, null=True)
    age_category = models.CharField( max_length=50,choices=age_cat,null=True)
    recordBy = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True) 
    def __str__(self):
        return f'{self.indicator}'
    

class TbScreening(models.Model):
    id = models.AutoField(primary_key=True)
    screenDate = models.DateField(auto_now_add=True)
    screenTime = models.TimeField(auto_now_add=True)  
    opNumber= models.ForeignKey(PatientBioData,on_delete=models.DO_NOTHING, null=True)
    visitId = models.ForeignKey(OpVisits, on_delete=models.DO_NOTHING, null=True)  
    indicator = models.ForeignKey(TbIndicators, on_delete=models.DO_NOTHING, null=True)
    status = models.CharField(max_length=10, null=True)    
    comments = models.CharField(max_length=100, null=True)    
    doctor = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)






    





