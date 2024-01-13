# Generated by Django 4.1.1 on 2023-01-30 12:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stores', '0006_rename_storehead_store_storemanager_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='store',
            name='status',
            field=models.CharField(choices=[('Active', 'Active'), ('dormant', 'dormant')], max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='store',
            name='category',
            field=models.CharField(choices=[('Main store', 'Main store'), ('Sub Store', 'Sub Store')], max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='store',
            name='servePoint',
            field=models.CharField(choices=[('Active', 'Active'), ('dormant', 'dormant')], max_length=20, null=True),
        ),
    ]