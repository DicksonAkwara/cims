# Generated by Django 4.1.1 on 2022-10-21 13:53

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('laboratory', '0002_labresult_sampleno_alter_labresult_confirmed_by_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='labresult',
            name='requestedit_by',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='editrequestby', to=settings.AUTH_USER_MODEL),
        ),
    ]
