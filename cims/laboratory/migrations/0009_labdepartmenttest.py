# Generated by Django 4.1.1 on 2023-01-10 09:53

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('MedicalRecords', '0016_rename_hospno_patientbiodata_op_number'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('laboratory', '0008_labmisstest_request_reff_no'),
    ]

    operations = [
        migrations.CreateModel(
            name='LabDepartmentTest',
            fields=[
                ('entryno', models.AutoField(primary_key=True, serialize=False)),
                ('entryDate', models.DateTimeField(auto_now_add=True, null=True)),
                ('createby', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
                ('departmentname', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='laboratory.labdepartment')),
                ('testname', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.services')),
            ],
        ),
    ]
