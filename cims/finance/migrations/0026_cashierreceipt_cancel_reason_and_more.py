# Generated by Django 4.1.1 on 2023-10-04 13:51

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('finance', '0025_waiver_vno_ip_waiver_vno_op_waivernotes_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='cashierreceipt',
            name='cancel_reason',
            field=models.CharField(max_length=250, null=True),
        ),
        migrations.AddField(
            model_name='cashierreceipt',
            name='cancelled_by',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='cancelled_by', to=settings.AUTH_USER_MODEL),
        ),
    ]