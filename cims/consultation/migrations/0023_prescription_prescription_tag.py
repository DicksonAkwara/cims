# Generated by Django 4.1.1 on 2023-11-08 18:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('consultation', '0022_consultation_chief_complain_tbscreening'),
    ]

    operations = [
        migrations.AddField(
            model_name='prescription',
            name='prescription_tag',
            field=models.CharField(max_length=100, null=True),
        ),
    ]