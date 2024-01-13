from django.urls import path
from . import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('mchindex/',views.mchindex, name='mchindex'),
    path('mchregistration/',views.mchregistration, name='mchregistration'),
    path('consmchpage/',views.consmchpage, name='consmchpage'),
    #path('searchInPatient/',csrf_exempt(views.searchInPatient), name='searchInPatient'),
    #path('registerIp/',csrf_exempt(views.registerIp), name='registerIp'),
]