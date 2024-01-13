# Generated by Django 4.1.1 on 2023-05-30 15:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('MedicalRecords', '0024_wlknumber'),
    ]

    operations = [
        migrations.CreateModel(
            name='wlkpatient',
            fields=[
                ('Id', models.AutoField(primary_key=True, serialize=False)),
                ('date_created', models.DateTimeField(auto_now_add=True, null=True)),
                ('wlkno', models.IntegerField(null=True)),
                ('fullname', models.CharField(max_length=250, null=True)),
                ('department', models.CharField(max_length=50, null=True)),
                ('services', models.CharField(max_length=250, null=True)),
                ('registered_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]