from django.urls import path
from . import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('',  views.phar_index, name='phar-index'),
    path('phar_reception/',  views.phar_reception, name='phar-reception'),
    path('pendpresc/',  views.pend_prescription, name='pendpresc'),
    path('paidpresc/',  views.pendpaidprescription, name='paidpresc'),
    path('search_drug/', csrf_exempt(views.search_drug), name='search_drug'),
    path('itemdata/',  views.loaditemdata, name='itemdata'),
    #path('pharmBill/', csrf_exempt(views.pharmBill), name='pharmBill'),
    path('pharmcashBill/', csrf_exempt(views.pharmcashBill), name='pharmcashBill'),
    path('search_receipt/', csrf_exempt(views.search_receipt), name='search_receipt'),
    path('pharmDispScheme/', views.pharmDispenseScheme, name='pharmDispScheme'),
    path('pharmDispCash/', views.pharmDispenseCash, name='pharmDispCash'),
    path('dispenselist/', csrf_exempt(views.dispense_list), name='dispenselist'),
    path('stockbalance/', csrf_exempt(views.stockbalance), name='stockbalance'),
    path('search_prescription/', csrf_exempt(views.search_prescription), name='search_prescription'),
   
]