# Generated by Django 4.1.1 on 2023-03-12 10:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MedicalRecords', '0019_ipvisit_dischargestatus'),
    ]

    operations = [
        migrations.AddField(
            model_name='opvisits',
            name='invoice_no',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
