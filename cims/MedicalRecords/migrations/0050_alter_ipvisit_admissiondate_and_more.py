# Generated by Django 4.1.1 on 2023-12-31 14:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MedicalRecords', '0049_alter_ipward_wardtype'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ipvisit',
            name='admissionDate',
            field=models.DateField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='ipvisit',
            name='admissionTime',
            field=models.TimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='opvisits',
            name='visit_date',
            field=models.DateField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='opvisits',
            name='visit_time',
            field=models.TimeField(auto_now_add=True, null=True),
        ),
    ]
