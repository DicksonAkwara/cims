# Generated by Django 4.1.1 on 2023-09-30 10:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('MedicalRecords', '0039_opvisits_category'),
        ('finance', '0019_patientbill_farewell_no'),
    ]

    operations = [
        migrations.AddField(
            model_name='patientbill',
            name='visitNoIp',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='MedicalRecords.ipvisit'),
        ),
    ]
