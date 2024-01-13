from django.urls import path
from . import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('sysindex/',views.sysindex, name='sysindex'),
    path('index/',views.index, name='index'),
    path('adminstats/',views.adminstats, name='adminstats'),   
    path('chartdata/',csrf_exempt(views.admincharts), name='chartdata'),   
]