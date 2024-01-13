# Generated by Django 4.1.1 on 2022-12-27 18:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('MedicalRecords', '0008_alter_ipvisit_ipnumber_delete_ippatient'),
    ]

    operations = [
        migrations.CreateModel(
            name='Theatre',
            fields=[
                ('Id', models.AutoField(primary_key=True, serialize=False)),
                ('Name', models.CharField(max_length=100)),
                ('date_created', models.DateField(auto_now_add=True)),
                ('capacity', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.residence')),
                ('staff', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
