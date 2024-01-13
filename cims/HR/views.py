from django.shortcuts import render
def hrindex(request):
    context={}   
    return render(request, 'dashboard/hr/hrindex.html', context)
