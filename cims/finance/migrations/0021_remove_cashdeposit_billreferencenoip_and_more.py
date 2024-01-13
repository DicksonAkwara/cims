# Generated by Django 4.1.1 on 2023-10-02 17:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('MedicalRecords', '0039_opvisits_category'),
        ('finance', '0020_patientbill_visitnoip'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cashdeposit',
            name='billReferenceNoIp',
        ),
        migrations.RemoveField(
            model_name='cashdeposit',
            name='billReferenceNoOp',
        ),
        migrations.AlterField(
            model_name='cashdeposit',
            name='visitNoIp',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.ipvisit'),
        ),
        migrations.AlterField(
            model_name='cashdeposit',
            name='visitNoOp',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.opvisits'),
        ),
    ]