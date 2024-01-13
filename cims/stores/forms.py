from django import forms
from .models import *

class SupplierForm(forms.ModelForm):
    class Meta:
        model = Supplier
        fields = '__all__'

class StoreItemForm(forms.ModelForm):
    class Meta:
        model = DrugGeneralItem
        fields = ['itemName','strength','itemCategory','package','itemDescp','price']



class StoreForm(forms.ModelForm):
    class Meta:
        model = Store
        fields = ['store_name','category','item_category','servePoint','purpose','storeManager','status']

class StoreAllocationForm(forms.ModelForm):
    class Meta:
        model = StoreAllocation
        fields = ['storeName','staffName','status']

