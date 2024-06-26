# Generated by Django 4.1.1 on 2023-09-29 11:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('MedicalRecords', '0037_schemes_limit_per_visit'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ipward',
            name='staff',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='opclinics',
            name='staff',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='patienttype',
            name='addedBy',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='specialclinic',
            name='staff',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='PatientCategory',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('categoryName', models.CharField(max_length=100)),
                ('description', models.CharField(max_length=50)),
                ('status', models.CharField(max_length=20)),
                ('dateCreated', models.DateField(auto_now_add=True)),
                ('staff', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
