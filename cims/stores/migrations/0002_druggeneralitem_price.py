# Generated by Django 4.1.1 on 2022-12-23 08:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stores', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='druggeneralitem',
            name='price',
            field=models.FloatField(null=True),
        ),
    ]