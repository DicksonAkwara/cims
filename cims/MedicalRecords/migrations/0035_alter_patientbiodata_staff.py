# Generated by Django 4.1.1 on 2023-06-07 18:56

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('MedicalRecords', '0034_alter_patientbiodata_trans_no'),
    ]

    operations = [
        migrations.AlterField(
            model_name='patientbiodata',
            name='staff',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL),
        ),
    ]
