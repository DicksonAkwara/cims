# Generated by Django 4.1.1 on 2023-04-05 22:45

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('sysadmin', '0004_nursestation'),
    ]

    operations = [
        migrations.CreateModel(
            name='Nurse_station_allocation',
            fields=[
                ('entryno', models.AutoField(primary_key=True, serialize=False)),
                ('assignedBy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='user', to=settings.AUTH_USER_MODEL)),
                ('staitonid', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='sysadmin.nursestation')),
                ('username', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='staff', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
