# Generated by Django 4.1.1 on 2023-01-07 12:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MedicalRecords', '0012_services_item_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='services',
            name='date_added',
            field=models.DateField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='services',
            name='status',
            field=models.CharField(max_length=100, null=True),
        ),
    ]