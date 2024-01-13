# Generated by Django 4.1.1 on 2024-01-08 23:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('MedicalRecords', '0050_alter_ipvisit_admissiondate_and_more'),
        ('finance', '0031_remove_patientbill_quantity_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='patientbill',
            name='quantity',
            field=models.FloatField(null=True),
        ),
        migrations.AddField(
            model_name='patientbill',
            name='total_price',
            field=models.FloatField(null=True),
        ),
        migrations.AddField(
            model_name='preauth_invoice',
            name='scheme',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.schemes'),
        ),
    ]