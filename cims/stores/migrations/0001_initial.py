# Generated by Django 4.1.1 on 2022-10-03 13:38

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='DrugGeneralItem',
            fields=[
                ('itemId', models.AutoField(primary_key=True, serialize=False)),
                ('itemName', models.CharField(max_length=250, null=True)),
                ('itemCategory', models.CharField(choices=[('Tablet', 'Tablet'), ('Suspension', 'Suspension'), ('Injection', 'Injection'), ('Suctures', 'Suctures'), ('Food-stuff', 'Food-stuff'), ('electronic', 'electronic'), ('stationery', 'stationery'), ('reagents', 'reagents'), ('containers', 'containers'), ('tubes', 'tubes'), ('cloth', 'cloth'), ('others', 'others')], max_length=50, null=True)),
                ('strength', models.CharField(max_length=50, null=True)),
                ('itemType', models.CharField(choices=[('Pharmaceutical', 'Pharmaceutical'), ('Non-Pharmaceutical', 'Non-Pharmaceutical')], max_length=50, null=True)),
                ('package', models.CharField(choices=[('bottle', 'bottle'), ('box', 'box'), ('packet', 'packet'), ('pieces', 'pieces'), ('container', 'container')], max_length=50, null=True)),
                ('itemDescp', models.CharField(max_length=200, null=True)),
                ('Balance', models.FloatField(null=True)),
                ('EditDateBalance', models.DateField(null=True)),
                ('dateAdded', models.DateField(auto_now_add=True)),
                ('addedBy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Store',
            fields=[
                ('store_Id', models.AutoField(primary_key=True, serialize=False)),
                ('store_name', models.CharField(max_length=100, null=True)),
                ('category', models.CharField(choices=[('mainstore', 'mainstore'), ('substore', 'substore')], max_length=50, null=True)),
                ('servePoint', models.CharField(choices=[('OPD', 'OPD'), ('IPD', 'IPD'), ('External facilities', 'External facilities'), ('All', 'All')], max_length=20, null=True)),
                ('dateAdded', models.DateField(auto_now_add=True)),
                ('addedBy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='addedby', to=settings.AUTH_USER_MODEL)),
                ('storeHead', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='storehead', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='StoreDelivery',
            fields=[
                ('deliveryId', models.AutoField(primary_key=True, serialize=False)),
                ('batchNo', models.CharField(max_length=100, null=True)),
                ('packageUnit', models.CharField(choices=[('bottle', 'bottle'), ('box', 'box'), ('packet', 'packet'), ('pieces', 'pieces'), ('container', 'container')], max_length=50, null=True)),
                ('packageCount', models.FloatField(null=True)),
                ('noItemsInPackage', models.FloatField(null=True)),
                ('totalItems', models.FloatField(null=True)),
                ('packagePrice', models.FloatField(null=True)),
                ('costperitem', models.FloatField(null=True)),
                ('sellprice', models.FloatField(null=True)),
                ('expiryDate', models.DateField(null=True)),
                ('deliverlyNoteNo', models.CharField(max_length=50, null=True)),
                ('deliverlyBy', models.CharField(max_length=100, null=True)),
                ('receivedDate', models.DateField(auto_now_add=True)),
                ('receiveStatus', models.CharField(max_length=20, null=True)),
                ('itemId', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='stores.druggeneralitem')),
                ('receivedBy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
                ('storeId', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='stores.store')),
            ],
        ),
        migrations.CreateModel(
            name='Supplier',
            fields=[
                ('supplierId', models.AutoField(primary_key=True, serialize=False)),
                ('supplierName', models.CharField(max_length=100, null=True)),
                ('phoneNo', models.IntegerField(null=True)),
                ('emailAddress', models.CharField(max_length=100, null=True)),
                ('supplyItem', models.CharField(choices=[('Pharmaceutical', 'Pharmaceutical'), ('Non-Pharmaceutical', 'Non-Pharmaceutical')], max_length=100, null=True)),
                ('registrationNo', models.CharField(max_length=100, null=True)),
                ('physicalAddress', models.CharField(max_length=100, null=True)),
                ('accountStatus', models.CharField(choices=[('Active', 'Active'), ('dormant', 'dormant')], max_length=100, null=True)),
                ('dateAdded', models.DateField(auto_now_add=True)),
                ('addedBy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='SubStoreItem',
            fields=[
                ('entryNo', models.AutoField(primary_key=True, serialize=False)),
                ('itemBalance', models.FloatField(null=True)),
                ('normalPrice', models.FloatField(null=True)),
                ('specialPrice', models.FloatField(null=True)),
                ('reorderLevel', models.CharField(max_length=50, null=True)),
                ('dateAdded', models.DateField(auto_now_add=True)),
                ('addedBy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('batchNo', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='stores.storedelivery')),
                ('itemCode', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='stores.druggeneralitem')),
                ('storeId', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='stores.store')),
            ],
        ),
        migrations.AddField(
            model_name='storedelivery',
            name='supplierId',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='stores.supplier'),
        ),
        migrations.CreateModel(
            name='StoreAllocation',
            fields=[
                ('entryNo', models.AutoField(primary_key=True, serialize=False)),
                ('status', models.CharField(max_length=50, null=True)),
                ('date', models.DateField(null=True)),
                ('assignedBy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='assignby', to=settings.AUTH_USER_MODEL)),
                ('staffName', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='userstore', to=settings.AUTH_USER_MODEL)),
                ('storeName', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='stores.store')),
            ],
        ),
        migrations.CreateModel(
            name='mainStoreItems',
            fields=[
                ('itemId', models.AutoField(primary_key=True, serialize=False)),
                ('itemName', models.CharField(max_length=250, null=True)),
                ('strength', models.CharField(max_length=50, null=True)),
                ('itemCategory', models.CharField(choices=[('Pharmaceutical', 'Pharmaceutical'), ('Non-Pharmaceutical', 'Non-Pharmaceutical')], max_length=50, null=True)),
                ('package', models.CharField(choices=[('bottle', 'bottle'), ('box', 'box'), ('packet', 'packet'), ('pieces', 'pieces'), ('container', 'container')], max_length=50, null=True)),
                ('description', models.CharField(max_length=200, null=True)),
                ('itemBalance', models.FloatField(null=True)),
                ('dateBalanceEdit', models.DateField(null=True)),
                ('dateAdded', models.DateField(auto_now_add=True)),
                ('addedBy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ItemOrder',
            fields=[
                ('orderNo', models.AutoField(primary_key=True, serialize=False)),
                ('requestNo', models.FloatField(null=True)),
                ('orderDate', models.DateField(auto_now_add=True)),
                ('requestQuantity', models.FloatField(null=True)),
                ('issueQuantity', models.FloatField(null=True)),
                ('issueDate', models.DateField(null=True)),
                ('remarks', models.CharField(max_length=50, null=True)),
                ('orderType', models.CharField(choices=[('internal', 'internal'), ('external', 'external')], max_length=50, null=True)),
                ('issueStatus', models.CharField(max_length=50, null=True)),
                ('extsupplier', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='stores.supplier')),
                ('issueBy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='issueby', to=settings.AUTH_USER_MODEL)),
                ('issueStore', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='tostore', to='stores.store')),
                ('itemCode', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='stores.druggeneralitem')),
                ('orderBy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='orderby', to=settings.AUTH_USER_MODEL)),
                ('orderStore', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='orderstore', to='stores.store')),
            ],
        ),
        migrations.CreateModel(
            name='ItemIssue',
            fields=[
                ('issueNo', models.AutoField(primary_key=True, serialize=False)),
                ('issueQuantity', models.FloatField(null=True)),
                ('batchno', models.CharField(max_length=100, null=True)),
                ('issueDate', models.DateField(null=True)),
                ('issueType', models.CharField(choices=[('internal', 'internal'), ('external', 'external')], max_length=50, null=True)),
                ('issueBy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='issuedby', to=settings.AUTH_USER_MODEL)),
                ('issuingStore', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='issuestore', to='stores.store')),
                ('receiveBy', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='receiveby', to=settings.AUTH_USER_MODEL)),
                ('receiveStore', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='receivestore', to='stores.store')),
                ('requestNo', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='stores.itemorder')),
            ],
        ),
    ]
