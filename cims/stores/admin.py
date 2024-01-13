from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(Store)
admin.site.register(DrugGeneralItem)
admin.site.register(SubStoreItem)
admin.site.register(Supplier)
admin.site.register(StoreDelivery)

