# Generated by Django 4.1.1 on 2023-01-03 16:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('finance', '0002_cashierreceipt_remove_patientbill_billtype_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='cashierreceipt',
            old_name='service_reff_no',
            new_name='billReffNo',
        ),
        migrations.RenameField(
            model_name='waiver',
            old_name='serviceReffNo',
            new_name='billReffNo',
        ),
        migrations.AddField(
            model_name='cashierreceipt',
            name='cashier',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='cashiereceipt', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='patientbill',
            name='visitStatus',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='cashierreceipt',
            name='trans_date',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='patientbill',
            name='bill_date',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='patientinvoice',
            name='invoice_date',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='waiver',
            name='waiver_date',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
