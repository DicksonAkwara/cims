# Generated by Django 4.2.6 on 2023-11-07 21:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MedicalRecords', '0042_remove_patientbiodata_trans_num'),
    ]

    operations = [
        migrations.AddField(
            model_name='patientbiodata',
            name='trans_no',
            field=models.CharField(max_length=10, null=True),
        ),
    ]