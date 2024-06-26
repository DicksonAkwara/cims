# Generated by Django 4.1.1 on 2023-01-30 23:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stores', '0009_itemorder_order_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='itemorder',
            name='orderType',
        ),
        migrations.AlterField(
            model_name='itemorder',
            name='issueDate',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='itemorder',
            name='orderDate',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='itemorder',
            name='remarks',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='itemorder',
            name='requestNo',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
