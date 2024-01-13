from django.db import models
#from django.contrib.auth.models import AbstractUser as User
from systemusers.models import CustomUser as User

StoreCategory = (
    ('Main store', 'Main store'),
    ('Sub Store', 'Sub Store'),
)
accountStatus = (
    ('Active', 'Active'),
    ('dormant', 'dormant'),
)
supplyItem = (
    ('Pharmaceuticals', 'Pharmaceuticals'),
    ('Non-Pharmaceuticals', 'Non-Pharmaceuticals'),  
    ('Both', 'Both'),  
    ('Laboratory', 'Laboratory'),  
)

ItemCategory = (
    ('Tablet', 'Tablet'),
    ('Suspension', 'Suspension'),
    ('Injection', 'Injection'),
    ('Suctures', 'Suctures'),
    ('Food-stuff', 'Food-stuff'),
    ('electronic', 'electronic'),
    ('stationery', 'stationery'),
    ('reagents', 'reagents'),
    ('containers', 'containers'),
    ('tubes', 'tubes'),
    ('cloth', 'cloth'),
    ('others', 'others'),
)

servePoint=( 
    ('OPD', 'OPD'),
    ('IPD', 'IPD'),    
    ('External facilities', 'External facilities'),
    ('All', 'All'),
)
ops=( 
    ('nursing', 'nursing'),
    ('pharmacy', 'pharmacy'),
)
package=( 
    ('bottle', 'bottle'),
    ('box', 'box'),    
    ('packet', 'packet'),
    ('pieces', 'pieces'),
    ('container', 'container'),
)



class Store(models.Model):
    store_Id = models.AutoField(primary_key=True)
    store_name = models.CharField(max_length=100, null=True)
    category = models.CharField(max_length=50, choices=StoreCategory, null=True)     
    item_category = models.CharField(max_length=50, choices=supplyItem, null=True)     
    servePoint = models.CharField(max_length=20,choices=servePoint,null=True)
    purpose = models.CharField(max_length=20,choices=ops,null=True)
    status = models.CharField(max_length=50,choices=accountStatus, null=True)
    storeManager = models.ForeignKey(User, on_delete=models.DO_NOTHING,related_name='storehead',null=True)  
    dateAdded = models.DateField(auto_now_add=True)    
    addedBy = models.ForeignKey(User, on_delete=models.DO_NOTHING,related_name='addedby',null=True)    
    
    def __str__(self):
        return f'{self.store_name}'

class StoreAllocation(models.Model):
    entryNo = models.AutoField(primary_key=True)
    storeName = models.ForeignKey(Store, on_delete=models.DO_NOTHING, null=True)    
    staffName = models.ForeignKey(User, on_delete=models.DO_NOTHING,related_name='userstore',null=True) 
    status = models.CharField(max_length=50,choices=accountStatus, null=True) 
    date = models.DateField(auto_now_add=True)    
    assignedBy = models.ForeignKey(User, on_delete=models.DO_NOTHING,related_name='assignby',null=True)    
    
    def __str__(self):
        return f'{self.staffName}({self.storeName})'


class DrugGeneralItem(models.Model):
    itemId = models.AutoField(primary_key=True)
    itemName = models.CharField(max_length=250, null=True)
    itemCategory = models.CharField(max_length=50, choices=supplyItem, null=True) 
    strength = models.CharField(max_length=100,null=True)
    #itemType = models.CharField(choices=supplyItem, max_length=100,null=True)
    package = models.CharField(max_length=100,null=True)
    itemDescp = models.CharField(max_length=250,null=True) 
    Balance = models.FloatField(null=True)
    EditDateBalance= models.DateField(null=True)   
    dateAdded = models.DateField(auto_now_add=True)
    addedBy = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True)
    price= models.FloatField(null=True)

    def __str__(self):
        return f'{self.itemName}({self.Balance})'


class mainStoreItems(models.Model):
    itemId = models.AutoField(primary_key=True)
    itemName = models.CharField(max_length=250, null=True)
    itemCategory = models.CharField(max_length=50, choices=ItemCategory, null=True) 
    strength = models.CharField(max_length=50,null=True)
    itemCategory = models.CharField(choices=supplyItem, max_length=50,null=True)
    package = models.CharField(choices=package, max_length=50,null=True)
    description = models.CharField(max_length=200,null=True) 
    itemBalance = models.FloatField(null=True)
    dateBalanceEdit= models.DateField(null=True)   
    dateAdded = models.DateField(auto_now_add=True)
    addedBy = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True)    
    


class Supplier(models.Model):
    supplierId = models.AutoField(primary_key=True)
    supplierName = models.CharField(max_length=100, null=True)
    phoneNo = models.IntegerField(null=True) 
    emailAddress = models.CharField(max_length=100,null=True)
    supplyItem = models.CharField(max_length=100,choices=supplyItem, null=True)     
    registrationNo = models.CharField(max_length=100,null=True)     
    physicalAddress = models.CharField(max_length=100,null=True)        
    accountStatus = models.CharField(max_length=100,choices=accountStatus, null=True)        
    dateAdded = models.DateField(auto_now_add=True)    
    addedBy = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True)    
    
    def __str__(self):
        return f'{self.supplierName}({self.supplyItem})'

class StoreDelivery(models.Model):
    deliveryId = models.AutoField(primary_key=True)
    storeId = models.ForeignKey(Store, on_delete=models.DO_NOTHING, null=True)
    supplierId = models.ForeignKey(Supplier, on_delete=models.DO_NOTHING, null=True) 
    itemId = models.ForeignKey(DrugGeneralItem, on_delete=models.DO_NOTHING, null=True)
    batchNo = models.CharField(max_length=100,null=True) 
    packageUnit = models.CharField(choices=package,max_length=50,null=True) #box,pieces,sachet,
    packageCount = models.FloatField(null=True) 
    noItemsInPackage = models.FloatField(null=True) 
    totalItems=models.FloatField(null=True)
    packagePrice = models.FloatField(null=True) 
    costperitem = models.FloatField(null=True) 
    sellprice = models.FloatField(null=True) 
    expiryDate = models.DateField(null=True)
    deliverlyNoteNo = models.CharField(max_length=50,null=True)
    lpoNo = models.CharField(max_length=50,null=True)
    deliverlyBy = models.CharField(max_length=100,null=True)    
    inspector = models.CharField(max_length=100,null=True)    
    receivedDate = models.DateField(auto_now_add=True) 
    receiveStatus = models.CharField(max_length=20,null=True)
    receivedBy = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True)    
    
    def __str__(self):
        return f'{self.deliverlyNoteNo}({self.totalItems})'
 

class SubStoreItem(models.Model):
    entryNo = models.AutoField(primary_key=True)
    itemCode = models.ForeignKey(DrugGeneralItem, on_delete=models.DO_NOTHING, null=True) 
    storeId = models.ForeignKey(Store, on_delete=models.DO_NOTHING, null=True) 
    #batchNo = models.ForeignKey(StoreDelivery, on_delete=models.DO_NOTHING, null=True) #deliveries
    itemBalance = models.FloatField(null=True)
    normalPrice = models.FloatField(null=True)
    specialPrice = models.FloatField(null=True) 
    reorderLevel = models.CharField(max_length=50,null=True)        
    dateAdded = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20,null=True)    
    addedBy = models.ForeignKey(User, on_delete=models.CASCADE, null=True)  
      
    """ 
    def __str__(self):
        return f'{self.itemCode}({self.itemBalance})' """

ordertype=( 
    ('internal', 'internal'),
    ('external', 'external')   
)
class ItemOrder(models.Model):
    orderNo = models.AutoField(primary_key=True) 
    requestNo = models.CharField(max_length=100,null=True)
    order_type = models.CharField(max_length=50,null=True)
    orderDate = models.DateTimeField(auto_now_add=True,null=True)   
    orderStore = models.ForeignKey(Store,related_name='orderstore', on_delete=models.DO_NOTHING, null=True) 
    issueStore = models.ForeignKey(Store,related_name='tostore', on_delete=models.DO_NOTHING, null=True) 
    itemCode = models.ForeignKey(DrugGeneralItem, on_delete=models.DO_NOTHING, null=True)  
    requestQuantity = models.FloatField(null=True)
    issueQuantity = models.FloatField(null=True)            
    issueDate = models.DateTimeField(null=True)    
    orderBy = models.ForeignKey(User,related_name='orderby', on_delete=models.DO_NOTHING, null=True)    
    issueBy = models.ForeignKey(User,related_name='issueby', on_delete=models.DO_NOTHING, null=True) 
    issueTo = models.CharField(max_length=100,null=True) 
    remarks = models.CharField(max_length=100,null=True)   
    extsupplier = models.ForeignKey(Supplier, on_delete=models.DO_NOTHING, null=True)
    issueStatus= models.CharField(max_length=50,null=True)    
    urgency= models.CharField(max_length=50,null=True)    
    def __str__(self):
        return f'{self.orderNo}({self.itemCode.itemName})'

class ItemIssue(models.Model):
    issueNo = models.AutoField(primary_key=True)  
    issueDate = models.DateField(auto_now_add=True)    
    issuingStore = models.ForeignKey(Store,related_name='issuestore', on_delete=models.DO_NOTHING, null=True) 
    requestNo = models.ForeignKey(ItemOrder, on_delete=models.DO_NOTHING, null=True)      
    issueQuantity = models.FloatField(null=True) 
    batchno = models.CharField( max_length=100,null=True)
    issueDate = models.DateField(null=True)    
    receiveBy = models.ForeignKey(User,related_name='receiveby', on_delete=models.DO_NOTHING, null=True)
    receiveStore = models.ForeignKey(Store,related_name='receivestore', on_delete=models.DO_NOTHING, null=True)   
    issueBy = models.ForeignKey(User,related_name='issuedby', on_delete=models.DO_NOTHING, null=True)       
    issueType = models.CharField(choices=ordertype, max_length=50,null=True) ## internal or external

    def __str__(self):
        return f'{self.issueNo}({self.requestNo.itemCode.itemName})'
    

class StoreReconciliation(models.Model):
    id = models.AutoField(primary_key=True)
    reconcile_date = models.DateTimeField(auto_now_add=True) 
    storename = models.ForeignKey(Store, on_delete=models.DO_NOTHING, null=True) 
    amount = models.FloatField(null=True)       
    itname = models.ForeignKey(DrugGeneralItem, on_delete=models.DO_NOTHING, null=True)
    reconcileBy = models.ForeignKey(User, on_delete=models.DO_NOTHING,related_name='reconcileby',null=True)    
    
    def __str__(self):
        return f'{self.reconcileBy}({self.storename})'




