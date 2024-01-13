# Generated by Django 4.1.1 on 2022-10-03 13:38

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('MedicalRecords', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Triage',
            fields=[
                ('triage_reff_no', models.AutoField(primary_key=True, serialize=False)),
                ('triage_date', models.DateField(auto_now_add=True)),
                ('triage_time', models.TimeField(auto_now_add=True)),
                ('temperature', models.FloatField(null=True)),
                ('blood_pressure', models.CharField(max_length=250, null=True)),
                ('pulse_rate', models.CharField(max_length=250, null=True)),
                ('weight', models.FloatField(null=True)),
                ('height', models.FloatField(null=True)),
                ('op_number', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='MedicalRecords.PatientBioData')),
                ('staff', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
