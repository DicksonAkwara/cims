# Generated by Django 4.1.1 on 2023-12-02 14:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('MedicalRecords', '0049_alter_ipward_wardtype'),
        ('consultation', '0023_prescription_prescription_tag'),
    ]

    operations = [
        migrations.AddField(
            model_name='consultation',
            name='wardName',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.ipward'),
        ),
    ]
