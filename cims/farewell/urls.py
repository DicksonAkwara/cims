from django.urls import path
from . import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
   path('',  views.fwindex, name='fwindex'),
   path('bdregister/',views.bdregister, name='bdregister'),
   path('bddispatch/',views.bddispatch, name='bddispatch'),
   path('bodyregister/',csrf_exempt(views.bodyregister), name='bodyregister'),
   path('fwbill/',views.fwbill, name='fwbill'),
   path('fwnames/',views.fwnames, name='fwnames'),
   path('searchbody/',csrf_exempt(views.searchbody), name='searchbody'),
   path('searchbill/',csrf_exempt(views.searchbill), name='searchbill'),




]