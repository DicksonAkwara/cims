# Generated by Django 4.1.1 on 2022-10-11 19:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('systemusers', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='fullname',
            field=models.CharField(blank=True, max_length=250),
        ),
    ]