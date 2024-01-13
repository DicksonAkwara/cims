from django.shortcuts import render

def crmindex(request):
    context={}   
    return render(request, 'dashboard/crm/comm.html', context)
