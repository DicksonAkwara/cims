# Generated by Django 4.1.1 on 2023-03-23 18:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('consultation', '0009_admission_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='disease',
            name='disease_name',
            field=models.CharField(max_length=150, null=True),
        ),
    ]
