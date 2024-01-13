# Generated by Django 4.1.1 on 2023-01-07 17:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('MedicalRecords', '0013_alter_services_date_added_alter_services_status'),
        ('consultation', '0002_consultation_hist_doctor_notes'),
    ]

    operations = [
        migrations.AddField(
            model_name='prescription',
            name='visitIp',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.ipvisit'),
        ),
        migrations.AddField(
            model_name='prescription',
            name='visitOp',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.opvisits'),
        ),
    ]