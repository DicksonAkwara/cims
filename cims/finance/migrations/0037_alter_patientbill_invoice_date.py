# Generated by Django 4.1.1 on 2024-01-11 15:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0036_preauth_form'),
    ]

    operations = [
        migrations.AlterField(
            model_name='patientbill',
            name='invoice_date',
            field=models.DateTimeField(null=True),
        ),
    ]
