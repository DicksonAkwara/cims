# Generated by Django 4.1.1 on 2023-07-15 14:07

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('finance', '0016_patientbill_wlknumber'),
    ]

    operations = [
        migrations.AddField(
            model_name='patientbill',
            name='request_by',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='request_by', to=settings.AUTH_USER_MODEL),
        ),
    ]
