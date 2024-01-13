# Generated by Django 4.1.1 on 2022-12-27 18:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stores', '0002_druggeneralitem_price'),
    ]

    operations = [
        migrations.AlterField(
            model_name='druggeneralitem',
            name='itemDescp',
            field=models.CharField(max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='druggeneralitem',
            name='itemName',
            field=models.CharField(max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='druggeneralitem',
            name='itemType',
            field=models.CharField(choices=[('DRUG', 'DRUG'), ('NON-PHARM', 'NON-PHARM')], max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='druggeneralitem',
            name='strength',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='mainstoreitems',
            name='itemCategory',
            field=models.CharField(choices=[('DRUG', 'DRUG'), ('NON-PHARM', 'NON-PHARM')], max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='store',
            name='category',
            field=models.CharField(choices=[('MAIN STORE', 'MAINSTORE'), ('SUB STORE', 'SUB STORE')], max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='storeallocation',
            name='date',
            field=models.DateField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='storeallocation',
            name='status',
            field=models.CharField(choices=[('Active', 'Active'), ('dormant', 'dormant')], max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='supplier',
            name='supplyItem',
            field=models.CharField(choices=[('DRUG', 'DRUG'), ('NON-PHARM', 'NON-PHARM')], max_length=100, null=True),
        ),
    ]