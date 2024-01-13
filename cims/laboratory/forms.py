from django import forms
from MedicalRecords.models import *
from .models import *

class LabtestForm(forms.ModelForm):
    class Meta:
        model = Services
        fields = ['service_name','normal_rate','scheme_rate','status']

class LabBenchForm(forms.ModelForm):
    class Meta:
        model = labDepartment
        fields = ['departmentname','description']

