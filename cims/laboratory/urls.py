from django.urls import path
from . import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
 path('',views.lab_index,name='lab_index'),
 path('lab_reception',views.lab_reception,name='lab-reception'),
 path('retrieve_request/',views.retrieve_request, name='retrieve-lab-request'),
 path('patientrequest/',views.retrieveptreq, name='patientrequest'),
 path('paidBillService/', csrf_exempt(views.paidBillService), name='paidBillService'),
 path('labRefreshList/', csrf_exempt(views.labRefreshList), name='labRefreshList'),
 path('labUnverifiedList/', csrf_exempt(views.labUnverifiedList), name='labUnverifiedList'),
 path('labEnterResult/', csrf_exempt(views.labEnterResult), name='labEnterResult'),
 path('labTestMiss/', csrf_exempt(views.labTestMiss), name='labTestMiss'),
 path('loadTestParams/', csrf_exempt(views.loadTestParams), name='loadTestParams'),
 path('labSaveResults/', csrf_exempt(views.labSaveResults), name='labSaveResults'),
 path('labSearchResult/', csrf_exempt(views.labSearchResult), name='labSearchResult'),
 path('SearchUnverifiedResult/', csrf_exempt(views.SearchUnverifiedResult), name='SearchUnverifiedResult'),
 path('loadEditResult/', csrf_exempt(views.loadEditResult), name='loadEditResult'),
 path('labVerifyResults/', csrf_exempt(views.labVerifyResults), name='labVerifyResults'),
 path('labAuthorizeEdit/', csrf_exempt(views.labAuthorizeEdit), name='labAuthorizeEdit'),
 path('labrequestEdit/', csrf_exempt(views.labrequestEdit), name='labrequestEdit'),
 path('loadVerifiedResult/', csrf_exempt(views.loadVerifiedResult), name='loadVerifiedResult'),
 path('labSearchService/', csrf_exempt(views.labSearchService), name='labSearchService'),
 path('labServiceDetails/', csrf_exempt(views.labServiceDetails), name='labServiceDetails'),
 path('saveDirectBill/', csrf_exempt(views.saveDirectBill), name='saveDirectBill'),
 path('labPatientCard/', csrf_exempt(views.labPatientCard), name='labPatientCard'),
 path('consLabResSearch/', csrf_exempt(views.consLabResSearch), name='consLabResSearch'),
 path('labfilterdaterequest/', csrf_exempt(views.labfilterdaterequest), name='labfilterdaterequest'),
 path('labRefreshResList/', csrf_exempt(views.labRefreshResList), name='labRefreshResList'),
 path('loadVerFilterRes/', csrf_exempt(views.loadVerFilterRes), name='loadVerFilterRes'),
 path('labstoreitems/', csrf_exempt(views.labstoreitems), name='labstoreitems'),
 path('labselecteditem/', csrf_exempt(views.labselecteditem), name='labselecteditem'),
 path('labitemorder/', csrf_exempt(views.labitemorder), name='labitemorder'),


  #### test urls #####################  
    path('testparamt/',  views.testparamt, name='testparamt'),
    path('addtest/',  views.addtest, name='addtest'),
    path('edittest/',  views.edittest, name='edittest'),
    path('labtestlist/',  csrf_exempt(views.labtestlist), name='labtestlist'),
    path('labtestParam/',  csrf_exempt(views.labtestParam), name='labtestParam'),
    path('dormantparam/',  csrf_exempt(views.dormantparam), name='dormantparam'),
    path('labparamadd/',  views.labparamadd, name='labparamadd'),
    path('confirmparamlist/',  csrf_exempt(views.confirmparamlist), name='confirmparamlist'),

    ##### reports urls###################
    path('labreports/',  views.labreports, name='labreports'),     
    path('labrepbrief/',  csrf_exempt(views.labrepbrief), name='labrepbrief'),
    path('labfilterbrief/',  csrf_exempt(views.labfilterbrief), name='labfilterbrief'),
    path('labloadreport/',  csrf_exempt(views.labloadreport), name='labloadreport'),

    ##### walk-in urls ################### 
    path('walkin/',  views.walkin, name='walkin'),
    path('save_bill/',  csrf_exempt(views.save_bill), name='save_bill'),

    path('labusers/',  views.labusers, name='labusers'),

    ############### test url for high values ########################
    path('high/',  views.checkHighValues, name='high'),
    
    ############### lab departments #################################  
    path('labdept',views.labdept,name='labdept'),
    path('savebenchtest/',views.savebenchtest,name='savebenchtest'),
    path('benchtestlist/',views.benchtestlist,name='benchtestlist'),
    path('savebench/',views.savebench,name='savebench'),
    path('updatebench/',views.updatebench,name='updatebench'),
     path('benchlist/',views.benchlist,name='benchlist'),

]