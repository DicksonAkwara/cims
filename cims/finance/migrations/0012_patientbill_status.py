# Generated by Django 4.1.1 on 2023-02-22 12:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0011_remove_cashierreceipt_receipt_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='patientbill',
            name='status',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
