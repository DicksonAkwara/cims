# Generated by Django 4.1.1 on 2023-01-07 15:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('MedicalRecords', '0013_alter_services_date_added_alter_services_status'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('finance', '0007_bill_adjustment_pat_card_cashdeposit_pat_card_and_more'),
        ('stores', '0004_remove_substoreitem_batchno'),
    ]

    operations = [
        migrations.CreateModel(
            name='PharmDispense',
            fields=[
                ('disp_id', models.AutoField(primary_key=True, serialize=False)),
                ('trasdate', models.DateTimeField(auto_now_add=True, null=True)),
                ('dosage', models.FloatField()),
                ('frequency', models.FloatField()),
                ('days', models.FloatField()),
                ('quant', models.FloatField()),
                ('total_price', models.FloatField()),
                ('receipt_no', models.CharField(max_length=100, null=True)),
                ('invoice_no', models.CharField(max_length=100, null=True)),
                ('status', models.CharField(max_length=100, null=True)),
                ('DispenseDate', models.DateField(auto_now_add=True, null=True)),
                ('drug_item', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='stores.druggeneralitem')),
                ('op_number', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='MedicalRecords.patientbiodata')),
                ('pharmacist', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
                ('reffno', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='finance.patientbill')),
                ('store', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='stores.store')),
            ],
        ),
    ]
