# Generated by Django 4.1.1 on 2023-01-07 10:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MedicalRecords', '0010_alter_theatre_capacity'),
    ]

    operations = [
        migrations.AddField(
            model_name='services',
            name='service_type',
            field=models.CharField(max_length=20, null=True),
        ),
    ]