# Generated by Django 4.1.1 on 2023-02-01 12:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stores', '0014_remove_druggeneralitem_itemtype_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='druggeneralitem',
            name='itemDescp',
            field=models.CharField(max_length=250, null=True),
        ),
        migrations.AlterField(
            model_name='druggeneralitem',
            name='itemName',
            field=models.CharField(max_length=250, null=True),
        ),
        migrations.AlterField(
            model_name='druggeneralitem',
            name='package',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
