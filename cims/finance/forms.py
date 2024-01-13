from django import forms
from MedicalRecords.models import *

class schemeForm(forms.ModelForm):
    class Meta:
        model = Schemes
        fields = ['scheme_name','payer','sub_name','paymode','expiryDate']