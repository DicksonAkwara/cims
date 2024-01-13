from django.urls import path
from . import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('',  views.rec_index, name='rec-index'),
    path('register/', views.RecRegister, name='rec-register'),
    path('register_new/', views.rec_register_patient, name='rec_register_patient'),
    # path('op_create_new/', views.CreateNewPatient.as_view(), name='rec-new-register'),
    #path('op_update_pat/', views.update_op_patient.as_view(), name='rec-update-pat'),
    # path('record_visit/', views.RecordVisit.as_view(), name='record-visit'),
    path('op_load_patient_details/', csrf_exempt(views.load_op_details), name='op-load-pat-details'),
    path('searchPatient/', csrf_exempt(views.search_op_patient), name='rec-search-patient'),
    path('load_sub_counties/', csrf_exempt(views.load_sub_counties), name='load-sub-counties'),

    #book clinic urls    
    path('reg_book_clinic/', views.rec_clinic_book, name='rec-book-clinic'),
    path('bk_clinic_search/',csrf_exempt(views.bk_clinic_search), name='bk-clinic-search'),
    path('savebookClinic/',csrf_exempt(views.savebookClinic), name='savebookClinic'),
    #path('save_bk_clinic/', views.save_bk_clinic.as_view(), name='save-bk-clinic'),
    path('load_future_clinics/', csrf_exempt(views.load_all_clinics), name='future-clinics'),
    path('clinicCategory/', csrf_exempt(views.clinicCategory), name='clinicCategory'),

    ############change payment mode##############
     path('recChangeMode/', views.recChangeMode, name='recChangeMode'),
     path('changePaymode/', csrf_exempt(views.changePaymode), name='changePaymode'),

    #records billing views
    path('reg_billing/', views.rec_billing, name='rec-billing'),   
    path('bill_pat_search/', csrf_exempt(views.bill_pat_search), name='bill-search-pat'),
    path('bill_svs_search/', csrf_exempt(views.bill_service_search), name='bill-svs-search'),
    path('bill_cons_search/', csrf_exempt(views.bill_cons_search), name='bill_cons_search'),
    path('bill_patient_name/', csrf_exempt(views.bill_patient_name), name='bill-patient-name'),
    path('save_bill/', csrf_exempt(views.save_bill), name='save-bill'),
    path('split_value/', csrf_exempt(views.split_value), name='split-bill'),    
    path('recRegisterList/',views.recRegisterList, name='recRegisterList'),
    path('filterClinicVisit/', csrf_exempt(views.filterClinicVisit), name='filterClinicVisit'),
    path('filterwardVisit/', csrf_exempt(views.filterwardVisit), name='filterwardVisit'),
    path('cons_bill_save/',csrf_exempt(views.cons_bill_save), name='cons_bill_save'),

    #######ip operations##############    
    path('registerInpatient/',views.registerInpatient, name='registerInpatient'),
    path('searchInPatient/',csrf_exempt(views.searchInPatient), name='searchInPatient'),
    path('rec_ipregister/',csrf_exempt(views.rec_ipregister), name='rec_ipregister'),
    path('registerIp/',csrf_exempt(views.registerIp), name='registerIp'),
    path('adm_request/',views.adm_request, name='adm_request'),
    path('daterequest/',views.adm_request_date, name='daterequest'),

    ############mchfFp#######################    
    #path('recmchclinic/',views.recmchclinic, name='recmchclinic'),
    path('mchindex/',views.mchindex, name='mchindex'),
    path('mchregistration/',views.mchregistration, name='mchregistration'),
    path('mchRegisterPatient/',views.mchRegisterPatient, name='mchRegisterPatient'),
    path('savebabyprofile/',views.savebabyprofile, name='savebabyprofile'),
    path('maidensearch/',csrf_exempt(views.maidensearch), name='maidensearch'),
    
    ################## record reports ########################### 
    path('rec_report/',views.rec_report, name='rec_report'),


    path('rec_pat_file/',views.rec_pat_file, name='rec_pat_file'),

    path('rec_upload/',views.rec_upload, name='rec_upload'),
    path('uploadoc/',csrf_exempt(views.uploadoc), name='uploadoc'),





    
   
]
