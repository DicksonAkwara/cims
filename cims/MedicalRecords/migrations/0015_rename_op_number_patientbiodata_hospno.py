# Generated by Django 4.1.1 on 2023-01-08 10:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('MedicalRecords', '0014_reverse_fake_migration'),
    ]

    operations = [
        migrations.RenameField(
            model_name='patientbiodata',
            old_name='op_number',
            new_name='hospNo',
        ),
    ]
