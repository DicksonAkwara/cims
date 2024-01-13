# Generated by Django 4.1.1 on 2024-01-08 12:47

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('MedicalRecords', '0050_alter_ipvisit_admissiondate_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('finance', '0030_alter_waivernotes_patient_no'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='patientbill',
            name='quantity',
        ),
        migrations.RemoveField(
            model_name='patientbill',
            name='total_price',
        ),
        migrations.CreateModel(
            name='Preauth_invoice',
            fields=[
                ('track_no', models.AutoField(primary_key=True, serialize=False)),
                ('DateRaised', models.DateTimeField(auto_now_add=True, null=True)),
                ('quantity', models.FloatField()),
                ('total_price', models.FloatField()),
                ('status', models.CharField(max_length=30)),
                ('preauth_no', models.CharField(max_length=100)),
                ('DateVerified', models.DateTimeField(null=True)),
                ('pat_card', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.patientbiodata')),
                ('patientType', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.patienttype')),
                ('raised_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='raisedby', to=settings.AUTH_USER_MODEL)),
                ('service', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.services')),
                ('verified_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='verifiedby', to=settings.AUTH_USER_MODEL)),
                ('visitNoIp', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.ipvisit')),
                ('visitNoOp', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.opvisits')),
            ],
        ),
    ]