# Generated by Django 4.1.1 on 2023-06-06 11:19

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('consultation', '0017_booktheater_schedule_date'),
    ]

    operations = [
        migrations.CreateModel(
            name='DeathCause',
            fields=[
                ('causeId', models.AutoField(primary_key=True, serialize=False)),
                ('dateAdded', models.DateField(auto_now_add=True)),
                ('cause', models.CharField(max_length=100, null=True)),
                ('recordBy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
