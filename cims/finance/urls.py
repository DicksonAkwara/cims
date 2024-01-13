from django.urls import path
from . import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('',  views.financeIndex, name='financeIndex'),
    path('cashpoint/',  views.cashpoint, name='cashpoint'),  
    path('cpSearchService/', csrf_exempt(views.cpSearchService), name='cpSearchService'),
    path('retrieveBill/', csrf_exempt(views.retrieveBill), name='retrieveBill'),
    path('checkshift/', csrf_exempt(views.checkshift), name='checkshift'),
    path('save_transaction/', csrf_exempt(views.save_transaction), name='save_transaction'), 
    path('save_walkin/', csrf_exempt(views.save_walkin), name='save_walkin'), 
     ### mpesa stk 
    path("stkpush/",views.initiate_push, name="stkpush"),
    path("callback/",views.callback, name="callback"),

    #path("callback/", views.MpesaCallbackView.as_view(), name="callback"),
    #path("transactions/", views.TransactionView.as_view(), name="transactions"),
    ################waivers###save_bill##########################
    path('waivers/',  views.waivers, name='waivers'), 
    ################refunds#########################
     path('patRefund/',  views.patRefund, name='patRefund'), 
    ################### cancel receipt ##################    
     path('cancelReceipt/',  views.cancelReceipt, name='cancelReceipt'), 
    ################### Bill Ajdustment ##################    
     path('billAdj/',  views.billAdj, name='billAdj'),
    ################### Patient Invoicing ##################    
     path('patInvoice/',  views.patInvoice, name='patInvoice'),

    ######################schemes #################################
     path('reg_scheme/',  views.reg_scheme, name='reg_scheme'),
     path('billing/', views.billing, name='billing'),
     path('schemebill/', csrf_exempt(views.schemebill), name='schemebill'),
     path('patientSchemeBill/', csrf_exempt(views.patientSchemeBill), name='patientSchemeBill'),
     path('finalizePatBill/', csrf_exempt(views.finalizePatBill), name='finalizePatBill'),
     path('loadbill/', csrf_exempt(views.loadbill), name='loadbill'),
     path('waivernotes/', csrf_exempt(views.savewaivernotes), name='waivernotes'),
     path('save_waiver/', csrf_exempt(views.save_waiver), name='save_waiver'),
     path('receipt_search/', csrf_exempt(views.receipt_search), name='receipt_search'),
     path('cancel_receipt/', csrf_exempt(views.cancel_receipt), name='cancel_receipt'),
     path('update_bill/',views.save_adjustment, name='update_bill'),


     ##########finalized invoices #####################  
     path('finalinvlist/', csrf_exempt(views.finalinvlist), name='finalinvlist'), 
     path('patFinalInv/', csrf_exempt(views.patFinalInv), name='patFinalInv'), 
     path('unfinalizeBill/', csrf_exempt(views.unfinalizeBill), name='unfinalizeBill'),
     path('removebill/', csrf_exempt(views.removebill), name='removebill'),
     path('preauth/', csrf_exempt(views.preath_invoice), name='preauth'),

     ############## finance reports ############################
     path('financereport/', csrf_exempt(views.financereport), name='financereport'),

     ################# reprint receipt ###############################  reprintReceipt  
     path('reprintReceipt/',views.reprintReceipt, name='reprintReceipt'), 


     path('genreportlab/',  views.genreportlab, name='genreportlab'),

     path('viewpdf/',  views.viewpdf, name='viewpdf'), 
     path('downloadpdf/',  views.downloadpdf, name='downloadpdf'),




     path('disease/',  views.fetch_icd11_dataset, name='disease'),

         


]