# Generated by Django 4.2.6 on 2023-11-07 21:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('MedicalRecords', '0041_rename_trans_no_patientbiodata_trans_num'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='patientbiodata',
            name='trans_num',
        ),
    ]
