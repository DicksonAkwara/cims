# Generated by Django 4.1.1 on 2022-12-17 09:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MedicalRecords', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='opvisits',
            name='urgency',
            field=models.CharField(max_length=30, null=True),
        ),
    ]