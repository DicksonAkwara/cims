# Generated by Django 4.1.1 on 2023-12-20 14:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stores', '0018_alter_druggeneralitem_itemcategory_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='storedelivery',
            name='inspector',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='storedelivery',
            name='lpoNo',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
