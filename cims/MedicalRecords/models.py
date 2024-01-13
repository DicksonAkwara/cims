from django.db import models
from systemusers.models import CustomUser as user
from stores.models import DrugGeneralItem


GENDER = (
    ('Male', 'Male'),
    ('Female', 'Female'),
    ('Transgender', 'Transgender'),
)
RELATION = (
    ('Sibling', 'Sibling'),
    ('Spouse', 'Spouse'),
    ('Parent', 'Parent'),
    ('Guardian', 'Guardian'),
    ('Cousin', 'Cousin'),
    ('Neighbour', 'Neighbour'),
    ('Friend', 'Friend'),
    ('well-wisher', 'well-wisher'),
)

ward_type = (
    ('Medical', 'Medical'),
    ('Surgical', 'Surgical'),
    ('Maternity', 'Maternity'),
    ('Paediatrics', 'Paediatrics'),
    ('Eye', 'Eye'),
    ('NBU', 'NBU'),
    ('Orthopaedic', 'Orthopaedic'),
    ('Isolation', 'Isolation'),
    ('Amenity', 'Amenity'),
    ('Psychiatry', 'Psychiatry'),
    ('Obst/Gyn', 'Obst/Gyn'),
    ('Others', 'Others'),
)

class relationship(models.Model):
    relCode = models.AutoField(primary_key=True)
    relName = models.CharField(max_length=30)
    def __str__(self):
        return f'{self.relName}'

class PatientBioData(models.Model):
    register_date = models.DateField(auto_now_add=True)    
    op_number = models.AutoField(primary_key=True)
    patient_no = models.CharField(max_length=100, null=True)
    fullname = models.CharField(max_length=200, null=True)
    national_idno = models.PositiveIntegerField(null=True)
    patient_DOB = models.DateField(null=True)
    patient_phone = models.PositiveIntegerField(null=True)
    patient_age = models.PositiveIntegerField(null=True)
    gender = models.CharField(max_length=20, null=True)    
    county = models.CharField(max_length=50, null=True)
    sub_county = models.CharField(max_length=50, null=True)
    residence = models.CharField(max_length=100, null=True)
    nok_name = models.CharField(max_length=200, null=True)
    nok_phone = models.PositiveIntegerField(null=True)
    nok_relation = models.CharField(max_length=100, null=True)
    trans_no = models.CharField(max_length=10, null=True)
    staff = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)

clinicType=(
    ('General','General'),
    ('Special','Special'),
)

class OpClinics(models.Model):
    clinic_code = models.AutoField(primary_key=True)
    clinic_name = models.CharField(max_length=100)
    description = models.CharField(max_length=200,null=True)
    clinic_type = models.CharField(max_length=30,choices=clinicType,null=True)
    date_created = models.DateField(auto_now_add=True)
    staff = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)

    def __str__(self):
        return f'{self.clinic_name}'
    
class SpecialClinic(models.Model):
    clinic_id = models.AutoField(primary_key=True)
    clinicName = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    dateCreated = models.DateField(auto_now_add=True)
    staff = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)
    def __str__(self):
        return f'{self.clinicName}'
    
class PatientCategory(models.Model):
    id = models.AutoField(primary_key=True)
    categoryName = models.CharField(max_length=100)
    description = models.CharField(max_length=50)
    status = models.CharField(max_length=20)
    dateCreated = models.DateField(auto_now_add=True)
    staff = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)
    def __str__(self):
        return f'{self.categoryName}'    


class mchClinic(models.Model):
    clinicNo =models.AutoField(primary_key=True)    
    clinicName = models.CharField(max_length=100)
    description = models.CharField(max_length=250)
    def __str__(self):
        return f'{self.clinicName}({self.clinicNo})'


class IpWard(models.Model):
    wardId = models.AutoField(primary_key=True)
    wardName = models.CharField(max_length=100)
    wardType = models.CharField(max_length=30,choices=ward_type, null=True)
    description = models.CharField(max_length=200, null=True)
    date_created = models.DateField(auto_now_add=True)
    staff = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)

    def __str__(self):
        return f'{self.wardName}'

patCategory = (
    ('Out-Patient', 'Out-Patient'),
    ('In-Patient', 'In-Patient'),
    ('Walk-In', 'Walk-In'),
    ('Day Care', 'Day Care'),
)

class PatientType(models.Model):
    entryNo=models.AutoField(primary_key=True)
    category = models.CharField(max_length=250,choices=patCategory,null=True)
    addedBy = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)

    def __str__(self):
        return f'{self.category}'

sch_paymode=(
    ('Rebate','Rebate'),
    ('Prepaid','Prepaid'),
)

from datetime import datetime

class Schemes(models.Model):
    scheme_id = models.AutoField(primary_key=True)
    dateCreated=models.DateField(auto_now_add=True)#default=datetime.now())
    scheme_name = models.CharField(max_length=200)
    payer = models.CharField(max_length=100)
    sub_name = models.CharField(max_length=100)
    paymode = models.CharField(max_length=100,choices=sch_paymode)
    expiryDate=models.DateField(null=True)
    staff = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)
    limit_per_visit = models.FloatField(null=True)


    def __str__(self):
        return f'{self.sub_name}'


class OpVisits(models.Model):
    visitNo = models.AutoField(primary_key=True)
    visit_date = models.DateField(auto_now_add=True,null=True)
    visit_time = models.TimeField(auto_now_add=True,null=True)    
    op_number = models.ForeignKey(PatientBioData, on_delete=models.DO_NOTHING, null=True)
    visit_type = models.CharField(max_length=20)
    clinic_name = models.ForeignKey(OpClinics, on_delete=models.DO_NOTHING, null=True)
    mchClinicName = models.ForeignKey(mchClinic, on_delete=models.DO_NOTHING, null=True)
    mchNumber = models.CharField(max_length=50, null=True)
    paymode = models.CharField(max_length=20, null=True)
    memberNo = models.CharField(max_length=50, null=True)
    invoice_no = models.CharField(max_length=50, null=True)
    urgency = models.CharField(max_length=30, null=True)
    subname = models.ForeignKey(Schemes, on_delete=models.DO_NOTHING, null=True)
    category = models.ForeignKey(PatientCategory, on_delete=models.DO_NOTHING, null=True)
    staff = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)

class IpVisit(models.Model):
    visitId = models.AutoField(primary_key=True)
    visitType = models.CharField(max_length=20, null=True)    
    admissionDate = models.DateField(auto_now_add=True,null=True)
    admissionTime = models.TimeField(auto_now_add=True,null=True)
    ipNumber = models.ForeignKey(PatientBioData, on_delete=models.DO_NOTHING, null=True)    
    wardName = models.ForeignKey(IpWard, on_delete=models.DO_NOTHING, null=True)
    fileNumber = models.CharField(max_length=30, null=True)
    paymode = models.CharField(max_length=20, null=True)
    memberNo = models.CharField(max_length=50, null=True)
    admissionType = models.CharField(max_length=20, null=True)
    patientCategory = models.CharField(max_length=100, null=True)
    admStatus= models.CharField(max_length=20, null=True,default='active')
    dischargeDate = models.DateField(null=True)
    dischargeTime = models.TimeField(null=True)
    DischargeStatus = models.CharField(max_length=50, null=True)
    subname = models.ForeignKey(Schemes, on_delete=models.DO_NOTHING, null=True)
    admittedBy = models.ForeignKey(user, related_name='admby', on_delete=models.DO_NOTHING, null=True)
    dischargeBy = models.ForeignKey(user,related_name='dichby', on_delete=models.DO_NOTHING, null=True)
    

    def __str__(self):
        return f'{self.visitId}'


class recClinicBook(models.Model):
    reff_number = models.AutoField(primary_key=True)
    record_date = models.DateField(auto_now_add=True)
    op_number = models.ForeignKey(PatientBioData, on_delete=models.CASCADE, null=True)
    clinic_name = models.ForeignKey(OpClinics, on_delete=models.CASCADE, null=True)
    clinic_date = models.DateField()    
    staff = models.ForeignKey(user, on_delete=models.CASCADE, null=True)

class ClinicAttendance(models.Model):
    reff_number = models.AutoField(primary_key=True)
    record_date = models.DateField(auto_now_add=True)
    op_number = models.ForeignKey(PatientBioData, on_delete=models.CASCADE, null=True)
    clinicNo = models.ForeignKey(recClinicBook, on_delete=models.CASCADE, null=True)    
    attend_status= models.BooleanField(null=True)
    attend_date = models.DateField(null=True)
    staff = models.ForeignKey(user, on_delete=models.CASCADE, null=True)


class Services(models.Model):
    scode = models.AutoField(primary_key=True)
    service_point = models.CharField(max_length=200)
    service_name = models.CharField(max_length=255)    
    service_type = models.CharField(max_length=20,null=True)  #service /item  
    normal_rate = models.FloatField()
    scheme_rate = models.FloatField()
    date_added = models.DateField(auto_now_add=True,null=True)
    staff = models.ForeignKey(user, on_delete=models.CASCADE, null=True)
    item_id = models.ForeignKey(DrugGeneralItem, on_delete=models.CASCADE, null=True)
    status= models.CharField(max_length=100,null=True)

    def __str__(self):
        return f'{self.service_name}({self.scode})'


   

class Residence(models.Model):
    reff_number =models.AutoField(primary_key=True)
    county_code=models.CharField(max_length=100)
    county_name = models.CharField(max_length=200)
    sub_county = models.CharField(max_length=200)


class referalFacility(models.Model):
    facilityId = models.AutoField(primary_key=True)
    facilityName = models.CharField(max_length=100)
    county = models.ForeignKey(Residence, on_delete=models.DO_NOTHING, null=True)
    date_created = models.DateField(auto_now_add=True)
    staff = models.ForeignKey(user, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f'{self.facilityName}'


class mchAncProfile(models.Model):
    profileDate = models.DateField(auto_now_add=True)
    profileId = models.AutoField(primary_key=True)
    cardNumber = models.ForeignKey(PatientBioData, on_delete=models.DO_NOTHING, null=True)
    KMHFLCode = models.CharField(max_length=100, null=True)    
    ancNumber = models.CharField(max_length=100, null=True)    
    gravida = models.CharField(max_length=100, null=True)    
    parity = models.CharField(max_length=100, null=True)    
    height = models.CharField(max_length=100, null=True)    
    weight = models.CharField(max_length=100, null=True)    
    lmp = models.DateField(null=True)
    edd = models.DateField(null=True)    
    surgicalOp= models.CharField(max_length=250, null=True)
    diabetis= models.CharField(max_length=250, null=True)
    hypertension= models.CharField(max_length=250, null=True)
    bloodTransfusion= models.CharField(max_length=250, null=True)
    tuberculosis= models.CharField(max_length=250, null=True)  
    drugAllergy = models.CharField(max_length=200, null=True)
    otherAllergies = models.CharField(max_length=100, null=True)
    familyTwins = models.CharField(max_length=100, null=True)  
    addNotes=models.CharField(max_length=250,null=True) 
    recordBy = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)

class previousAncPregancy(models.Model):
    date = models.DateField(auto_now_add=True)
    serialNo = models.AutoField(primary_key=True)
    profileId=models.ForeignKey(mchAncProfile, on_delete=models.DO_NOTHING, null=True)
    PregnancyOrder=models.CharField(max_length=30,null=True)
    YearOfBirth=models.IntegerField(null=True)
    ancPerpregnacy=models.CharField(max_length=30,null=True)
    placeOfBirth= models.CharField(max_length=150, null=True)
    gestationPeriod= models.CharField(max_length=100, null=True) #in weeks
    labourPeriod= models.CharField(max_length=100, null=True)
    deliveryMode= models.CharField(max_length=100, null=True)
    birthWeight= models.CharField(max_length=100, null=True)    
    childsex= models.CharField(max_length=100, null=True)
    outcome= models.CharField(max_length=100, null=True)
    puerperium= models.CharField(max_length=100, null=True)
    recordBy = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)

class ancVisits(models.Model):
    visitId = models.AutoField(primary_key=True)
    cardNumber = models.ForeignKey(PatientBioData, on_delete=models.DO_NOTHING, null=True)
    profileNumber = models.ForeignKey(mchAncProfile, on_delete=models.DO_NOTHING, null=True)
    ancType=models.CharField(max_length=50, null=True)
    profileDate = models.DateField(auto_now_add=True)
    generalExam= models.CharField(max_length=250, null=True)
    bloodPress= models.CharField(max_length=100, null=True)
    pulseRate= models.CharField(max_length=100, null=True)
    weight= models.CharField(max_length=100, null=True)
    breast= models.CharField(max_length=100, null=True)
    abdomen= models.CharField(max_length=100, null=True)
    genitaliaExam= models.CharField(max_length=250, null=True)
    genitalDischarge= models.CharField(max_length=250, null=True)
    HB= models.CharField(max_length=100, null=True)
    bloodGroup= models.CharField(max_length=100, null=True)
    rhesus= models.CharField(max_length=100, null=True)
    urinalyis= models.CharField(max_length=100, null=True)
    bloodRbs= models.CharField(max_length=250, null=True)
    TB= models.CharField(max_length=250, null=True)
    HIV= models.CharField(max_length=250, null=True)
    syphilis= models.CharField(max_length=250, null=True)
    hepatitisB= models.CharField(max_length=250, null=True)
    hivCounsel= models.CharField(max_length=250, null=True)
    partnerHivTest= models.CharField(max_length=250, null=True)
    #subsequent visits details
    muacHeight= models.CharField(max_length=100, null=True)
    pallor= models.CharField(max_length=100, null=True)
    gestationPeriod= models.CharField(max_length=100, null=True)
    fundalHeight= models.CharField(max_length=100, null=True)
    presentation= models.CharField(max_length=100, null=True)
    lie= models.CharField(max_length=100, null=True)
    foetalHeartRate= models.CharField(max_length=100, null=True)
    foetalHeartMvt= models.CharField(max_length=100, null=True)
    mentalhealth= models.CharField(max_length=250, null=True)
    clinicalNotes= models.CharField(max_length=250, null=True)
    nextVisit = models.DateField(null=True)
    recordBy = models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)

class pncbaby(models.Model):
    babyId = models.AutoField(primary_key=True)
    maidenNumber = models.ForeignKey(PatientBioData, on_delete=models.DO_NOTHING, null=True)
    ancprofileNumber = models.ForeignKey(mchAncProfile, on_delete=models.DO_NOTHING, null=True)
    babyname=models.CharField(max_length=250, null=True)
    Dateofbirth = models.DateField(null=True)
    gender= models.CharField(max_length=250, null=True)
    placeofbirth= models.CharField(max_length=100, null=True)
    recoredby= models.ForeignKey(user, on_delete=models.DO_NOTHING, null=True)

class Theatre(models.Model):
    Id = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=100)
    capacity = models.FloatField(null=True)
    date_created = models.DateField(auto_now_add=True)
    staff = models.ForeignKey(user, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f'{self.Name}'
    
class wlknumber(models.Model):
    Id = models.AutoField(primary_key=True)
    wlkno = models.IntegerField(null=True)
    
    def __str__(self):
        return f'{self.wlkno}'
    

class wlkpatient(models.Model):
    Id = models.AutoField(primary_key=True)
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    wlkno = models.CharField(max_length=50,null=True)
    fullname= models.CharField(max_length=250, null=True)
    department= models.CharField(max_length=50, null=True)
    services= models.CharField(max_length=250, null=True)
    registered_by= models.ForeignKey(user, on_delete=models.CASCADE, null=True)
    
    def __str__(self):
        return f'{self.fullname}'








    












  

