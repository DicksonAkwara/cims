
from django.shortcuts import render
from MedicalRecords.models import relationship
def gateindex(request):
    context={}   
    return render(request, 'dashboard/gatepass/gateindex.html', context)

def releasepage(request):
    rlship=relationship.objects.all().order_by('relName')
    context={
        'relation':rlship
    }   
    return render(request, 'dashboard/gatepass/patientrelease.html', context)
