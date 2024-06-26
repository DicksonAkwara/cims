# Generated by Django 4.1.1 on 2022-10-03 13:38

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('stores', '0001_initial'),
        ('MedicalRecords', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Disease',
            fields=[
                ('disease_code', models.AutoField(primary_key=True, serialize=False)),
                ('disease_name', models.CharField(max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='familyPlan',
            fields=[
                ('fpId', models.AutoField(primary_key=True, serialize=False)),
                ('fpno', models.CharField(max_length=50, null=True)),
                ('adminDate', models.DateField(auto_now_add=True)),
                ('endDate', models.DateField(auto_now_add=True)),
                ('quantity', models.CharField(max_length=20, null=True)),
                ('status', models.CharField(max_length=20, null=True)),
                ('discReason', models.CharField(max_length=100, null=True)),
                ('cardNumber', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.PatientBioData')),
            ],
        ),
        migrations.CreateModel(
            name='immuneVaccine',
            fields=[
                ('vaccineId', models.AutoField(primary_key=True, serialize=False)),
                ('vaccineName', models.CharField(max_length=100, null=True)),
                ('acronym', models.CharField(max_length=100, null=True)),
                ('apllicationMethod', models.CharField(choices=[('oral', 'oral'), ('injection', 'injection')], max_length=20, null=True)),
                ('bodyPart', models.CharField(choices=[('intra-dermal left forearm', 'intra-dermal left forearm'), ('mouth', 'mouth'), ('intra-muscular outer aspect right thigh(2 fingers apart from PCV10 site)', 'intra-muscular outer aspect right thigh(2 fingers apart from PCV10 site)'), ('intra-muscular left outer thigh', 'intra-muscular left outer thigh'), ('intra-muscular upper outeraspect right thigh', 'intra-muscular upper outeraspect right thigh'), ('deep subcutaneous upper right arm deltoid muscle', 'deep subcutaneous upper right arm deltoid muscle'), ('intra-muscular left upper deltoid', 'intra-muscular left upper deltoid')], max_length=200, null=True)),
                ('vaccinePeriod', models.CharField(choices=[('Birth', 'Birth'), ('6 weeks', '6 weeks'), ('10 weeks', '10 weeks'), ('14 weeks', '14 weeks'), ('6 months', '6 months'), ('9 months', '9 months'), ('18 months', '18 months')], max_length=50, null=True)),
                ('addedby', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='specialClinicCondition',
            fields=[
                ('conditionId', models.AutoField(primary_key=True, serialize=False)),
                ('dateAdded', models.DateField(auto_now_add=True)),
                ('spDepartment', models.CharField(choices=[('Eye', 'Eye'), ('Dental', 'Dental'), ('GBV', 'GBV')], max_length=50, null=True)),
                ('conditionName', models.CharField(max_length=100, null=True)),
                ('conditionDesc', models.CharField(max_length=100, null=True)),
                ('recordBy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='specialClinicProcedure',
            fields=[
                ('procedureId', models.AutoField(primary_key=True, serialize=False)),
                ('dateAdded', models.DateField(auto_now_add=True)),
                ('spDepartment', models.CharField(choices=[('Eye', 'Eye'), ('Dental', 'Dental'), ('GBV', 'GBV')], max_length=50, null=True)),
                ('procedureName', models.CharField(max_length=100, null=True)),
                ('procedureDesc', models.CharField(max_length=100, null=True)),
                ('recordBy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='vaccineComplain',
            fields=[
                ('complainId', models.AutoField(primary_key=True, serialize=False)),
                ('complainDate', models.DateField(auto_now_add=True)),
                ('manufacturer', models.CharField(max_length=200, null=True)),
                ('manufactureDate', models.DateField(null=True)),
                ('expiryDate', models.DateField(null=True)),
                ('complainDescription', models.CharField(max_length=250, null=True)),
                ('addedby', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
                ('babyNo', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.pncbaby')),
                ('maidenNo', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.PatientBioData')),
                ('vaccineName', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='consultation.immunevaccine')),
            ],
        ),
        migrations.CreateModel(
            name='specialConsult',
            fields=[
                ('cons_reff', models.AutoField(primary_key=True, serialize=False)),
                ('cons_date', models.DateField(auto_now_add=True)),
                ('cons_receive_time', models.TimeField(auto_now_add=True)),
                ('complainFindings', models.CharField(max_length=250, null=True)),
                ('acuityleft', models.CharField(max_length=20, null=True)),
                ('acuityright', models.CharField(max_length=20, null=True)),
                ('eyepartselect', models.CharField(max_length=100, null=True)),
                ('dentalptype', models.CharField(max_length=20, null=True)),
                ('toothselect', models.CharField(max_length=100, null=True)),
                ('additionNotes', models.CharField(max_length=250, null=True)),
                ('cons_leave_time', models.TimeField(null=True)),
                ('condition', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='consultation.specialcliniccondition')),
                ('doctor', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
                ('op_number', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.PatientBioData')),
                ('procedure', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='consultation.specialclinicprocedure')),
                ('specialClinic', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.opclinics')),
            ],
        ),
        migrations.CreateModel(
            name='ServiceRequest',
            fields=[
                ('requestNo', models.AutoField(primary_key=True, serialize=False)),
                ('reqDate', models.DateField(auto_now_add=True)),
                ('reqTime', models.TimeField(auto_now_add=True)),
                ('quantity', models.IntegerField(null=True)),
                ('urgency', models.CharField(max_length=100, null=True)),
                ('status', models.CharField(max_length=100, null=True)),
                ('doctor', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
                ('opNumber', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.PatientBioData')),
                ('paymode', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.schemes')),
                ('serviceCode', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.services')),
            ],
        ),
        migrations.CreateModel(
            name='Prescription',
            fields=[
                ('prescNo', models.AutoField(primary_key=True, serialize=False)),
                ('prescDate', models.DateField(auto_now_add=True)),
                ('prescTime', models.TimeField(auto_now_add=True)),
                ('dosage', models.CharField(max_length=50, null=True)),
                ('frequency', models.CharField(max_length=50, null=True)),
                ('days', models.CharField(max_length=50, null=True)),
                ('quantity', models.IntegerField(null=True)),
                ('status', models.CharField(max_length=100, null=True)),
                ('doctor', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
                ('itemCode', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='stores.druggeneralitem')),
                ('opNumber', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.PatientBioData')),
                ('storeId', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='stores.store')),
            ],
        ),
        migrations.CreateModel(
            name='pncVisit',
            fields=[
                ('visitId', models.AutoField(primary_key=True, serialize=False)),
                ('visitDate', models.DateField(auto_now_add=True)),
                ('visitperiod', models.CharField(max_length=50, null=True)),
                ('bloodPress', models.CharField(max_length=50, null=True)),
                ('pulseRate', models.CharField(max_length=50, null=True)),
                ('temperature', models.CharField(max_length=20, null=True)),
                ('weight', models.CharField(max_length=20, null=True)),
                ('generalExam', models.CharField(max_length=200, null=True)),
                ('breast', models.CharField(max_length=100, null=True)),
                ('csScar', models.CharField(max_length=100, null=True)),
                ('uterusInvolution', models.CharField(max_length=100, null=True)),
                ('pelvicExam', models.CharField(max_length=200, null=True)),
                ('episiotomy', models.CharField(max_length=100, null=True)),
                ('fistula', models.CharField(max_length=100, null=True)),
                ('lochia', models.CharField(max_length=50, null=True)),
                ('hivStatus', models.CharField(max_length=20, null=True)),
                ('counseling', models.CharField(max_length=50, null=True)),
                ('fpMethod', models.CharField(max_length=100, null=True)),
                ('fpSpec', models.CharField(max_length=100, null=True)),
                ('clinicalNotes', models.CharField(max_length=250, null=True)),
                ('nextVisit', models.DateField(null=True)),
                ('cardNumber', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.PatientBioData')),
                ('recordBy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='pncBabyVisit',
            fields=[
                ('visitId', models.AutoField(primary_key=True, serialize=False)),
                ('visitperiod', models.CharField(max_length=50, null=True)),
                ('visitDate', models.DateField(auto_now_add=True)),
                ('generalExam', models.CharField(max_length=250, null=True)),
                ('temperature', models.CharField(max_length=50, null=True)),
                ('pulserate', models.CharField(max_length=50, null=True)),
                ('weight', models.CharField(max_length=50, null=True)),
                ('feedMethod', models.CharField(max_length=100, null=True)),
                ('breastFeed', models.CharField(max_length=100, null=True)),
                ('umbilicalCord', models.CharField(max_length=100, null=True)),
                ('nextVisit', models.DateField(null=True)),
                ('clinicalNotes', models.CharField(max_length=250, null=True)),
                ('babyNo', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.pncbaby')),
                ('cardNumber', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.PatientBioData')),
                ('recordBy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='patientReferral',
            fields=[
                ('ReffNo', models.AutoField(primary_key=True, serialize=False)),
                ('requestDate', models.DateField(auto_now_add=True)),
                ('referralTime', models.TimeField(auto_now_add=True)),
                ('referralType', models.CharField(max_length=50, null=True)),
                ('cardNo', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.PatientBioData')),
                ('doctor', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
                ('referralFrom', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='rffrom', to='MedicalRecords.opclinics')),
                ('referralToExt', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.referalfacility')),
                ('referralToINT', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='tfto', to='MedicalRecords.opclinics')),
            ],
        ),
        migrations.CreateModel(
            name='famPlanMethod',
            fields=[
                ('fpnumber', models.AutoField(primary_key=True, serialize=False)),
                ('acronym', models.CharField(max_length=100, null=True)),
                ('description', models.CharField(max_length=150, null=True)),
                ('addedby', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='familyPlanComplain',
            fields=[
                ('complainId', models.AutoField(primary_key=True, serialize=False)),
                ('complainDate', models.DateField(auto_now_add=True)),
                ('batchno', models.CharField(max_length=50, null=True)),
                ('manufacturer', models.CharField(max_length=200, null=True)),
                ('manufactureDate', models.DateField(null=True)),
                ('expiryDate', models.DateField(null=True)),
                ('complainDescription', models.CharField(max_length=250, null=True)),
                ('cardnumber', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.PatientBioData')),
                ('fpid', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='consultation.familyplan')),
                ('fpmethod', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='consultation.famplanmethod')),
                ('recordBy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='familyplan',
            name='fpmethod',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='consultation.famplanmethod'),
        ),
        migrations.AddField(
            model_name='familyplan',
            name='recordBy',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Consultation',
            fields=[
                ('cons_reff', models.AutoField(primary_key=True, serialize=False)),
                ('cons_date', models.DateField(auto_now_add=True)),
                ('cons_receive_time', models.TimeField(auto_now_add=True)),
                ('doctor_notes', models.CharField(max_length=250, null=True)),
                ('service', models.CharField(max_length=250, null=True)),
                ('status', models.CharField(max_length=50, null=True)),
                ('cons_leave_time', models.TimeField(null=True)),
                ('clinicName', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.opclinics')),
                ('confirmed_diagnosis', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='confirmed', to='consultation.disease')),
                ('doctor', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
                ('op_number', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.PatientBioData')),
                ('provisional_diagnosis', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='provisional', to='consultation.disease')),
            ],
        ),
        migrations.CreateModel(
            name='ClinicBook',
            fields=[
                ('BookReffNo', models.AutoField(primary_key=True, serialize=False)),
                ('requestDate', models.DateField(auto_now_add=True)),
                ('requestTime', models.TimeField(auto_now_add=True)),
                ('bookDate', models.DateField(null=True)),
                ('bookType', models.CharField(max_length=50, null=True)),
                ('bookNotes', models.CharField(max_length=250, null=True)),
                ('recStatus', models.CharField(max_length=100, null=True)),
                ('bookClinic', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.opclinics')),
                ('cardNo', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.PatientBioData')),
                ('doctor', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='babyVaccine',
            fields=[
                ('immunizationId', models.AutoField(primary_key=True, serialize=False)),
                ('vaccineDate', models.DateField(auto_now_add=True)),
                ('vaccinePeriod', models.CharField(max_length=50, null=True)),
                ('nextDate', models.DateField(null=True)),
                ('addedby', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
                ('babyNo', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.pncbaby')),
                ('maidenNo', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.PatientBioData')),
                ('vaccineName', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='consultation.immunevaccine')),
            ],
        ),
        migrations.CreateModel(
            name='Admission',
            fields=[
                ('admReffNo', models.AutoField(primary_key=True, serialize=False)),
                ('requestDate', models.DateField(auto_now_add=True)),
                ('requestTime', models.TimeField(auto_now_add=True)),
                ('doctor_notes', models.CharField(max_length=250, null=True)),
                ('doctor', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
                ('op_number', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.PatientBioData')),
                ('ward', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.ipward')),
            ],
        ),
    ]
