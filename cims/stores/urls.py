from django.urls import path
from . import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('',  views.storeindex, name='storeindex'),
    path('supplier/',  views.supplier, name='supplier'),
    path('addsupplier/',  views.addsupplier, name='addsupplier'),
    path('storeitems/',  views.storeitems, name='storeitems'),
    path('addstoreItem/',  views.addstoreItem, name='addstoreItem'),
    path('stores/',  views.stores, name='stores'),
    path('addstores/',  views.addstores, name='addstores'),
    path('editstoreItem/',  views.editstoreItem, name='editstoreItem'),
    path('storeallocate/',  views.storeallocate, name='storeallocate'),
    ###################make order ###############
    path('makeorder/',  views.makeorder, name='makeorder'),
    path('searchItem/', csrf_exempt(views.searchItem), name='searchItem'),
    path('itemdetails/', csrf_exempt(views.itemdetails), name='itemdetails'),
    path('confirmitemorder/',  csrf_exempt(views.confirmitemorder), name='confirmitemorder'),
    path('pendorders/',  csrf_exempt(views.pendorders), name='pendorders'),
    path('fetchpendorders/',  csrf_exempt(views.fetchpendorders), name='fetchpendorders'),

    ################### receive stock ##############################
    path('receivestock/',  views.receivestock, name='receivestock'),
    path('confrecstock/',  views.confrecstock, name='confrecstock'),
    path('receivestockitem/',views.receivestockitem, name='receivestockitem'),
    path('refreshreclist/', csrf_exempt(views.refreshreclist), name='refreshreclist'),
    path('penddelnote/',views.pend_delv_note, name='penddelnote'),
    path('removestockitem/',views.rmitem, name='removestockitem'),
    path('confirmreclist/',  csrf_exempt(views.confirmreclist), name='confirmreclist'),
    path('amendstockitem/',  csrf_exempt(views.amendstockitem), name='amendstockitem'),
    path('copy/',  csrf_exempt(views.copystoreitems), name='copy'),###trial url to copy items tosubstore  
    path('loaditems/',  csrf_exempt(views.loaditems), name='loaditems'),

    ################ issue store ########################### 
    path('issuestock/',  views.issuestock, name='issuestock'),
    path('fetchrqitems/',  csrf_exempt(views.fetchrqitems), name='fetchrqitems'),
    path('confirm_os/',  csrf_exempt(views.confirm_os), name='confirm_os'),
    path('confirm_issue/',  csrf_exempt(views.confirm_issue), name='confirm_issue'),

    ################## stock Prices ######################    
    path('stockprices/',  views.stockprices, name='stockprices'),
    path('fetchprices/',  csrf_exempt(views.fetchprices), name='fetchprices'),
    path('changeprice/',  csrf_exempt(views.changeprice), name='changeprice'),

    ################# stock reconciliation ###################  
    path('reconcile/',  views.reconcile, name='reconcile'),
    path('reconcile_item/',  views.reconcile_item, name='reconcile_item'),


    ###################test pdf ######################
    path('generatepdf/', views.generate_pdf, name='generatepdf'),
]

