from django.urls import path
from . import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('cons_index/',  views.cons_index, name='cons_index'),
    path('general_cons/',  views.general_cons, name='consult_gen'),   
    path('cons_pat_search/', csrf_exempt(views.cons_pat_search), name='cons-pat-search'),
    path('search_walkin/', csrf_exempt(views.search_walkin), name='search_walkin'),
    path('cons_service_search/', csrf_exempt(views.cons_search_service), name='cons-svs-search'),
    path('cons_pharm_search/', csrf_exempt(views.cons_pharm_search), name='cons-pharm-search'),
    path('check_diagnosis_entry/', csrf_exempt(views.check_diagnosis_entry), name='checkDiagnosisEntry'),
    path('cons_search_diagnosis/', csrf_exempt(views.cons_search_diagnosis), name='cons-diag-search'),
    path('triage_search/', csrf_exempt(views.triage_search), name='triage-search'),
    path('receive_patient/', csrf_exempt(views.receive_patient), name='receive-patient'),
    path('save_doctor_notes/', csrf_exempt(views.save_doctor_notes), name='save-doctor-notes'),
    path('save_diagnosis/', csrf_exempt(views.save_diagnosis), name='saveDiagnosis'),
    path('save_svs_request/', csrf_exempt(views.save_svs_request), name='save-svs-request'),
    path('savePrescription/', csrf_exempt(views.savePrescription), name='savePrescription'),
    path('saveAdmission/', csrf_exempt(views.saveAdmission), name='saveAdmission'),
    path('saveClinicBook/', csrf_exempt(views.saveClinicBook), name='saveClinicBook'),
    path('listDestination/',csrf_exempt(views.listDestination), name='listDestination'),
    path('saveReferral/',csrf_exempt(views.saveReferral), name='saveReferral'),
    path('referralOpvisit/',csrf_exempt(views.referralOpvisit), name='referralOpvisit'),
    path('loadWards/',csrf_exempt(views.loadWards), name='loadWards'),
    path('loadClinics/',csrf_exempt(views.loadClinics), name='loadClinics'),
    path('findprevnotes/',csrf_exempt(views.findprevnotes), name='findprevnotes'),
    path('patcard/',csrf_exempt(views.patcard), name='patcard'),


    #########mch fp ##########################
    path('consmchpage/', views.consmchpage, name='consmchpage'), 
    path('searchMatProfile/',csrf_exempt(views.searchMatProfile), name='searchMatProfile'),
    path('saveMatProfile/',views.saveMatProfile, name='saveMatProfile'),
    path('saveMSHProfile/',views.saveMSHProfile, name='saveMSHProfile'),
    path('saveprevPregnancy/',views.saveprevPregnancy, name='saveprevPregnancy'),
    path('saveancfirstVisit/',views.saveancfirstVisit, name='saveancfirstVisit'),
    path('saveAntprofVisit/',views.saveAntprofVisit, name='saveAntprofVisit'),
    path('savesubseqAncVisit/',views.savesubseqAncVisit, name='savesubseqAncVisit'),
    path('loadVaccineTime/',csrf_exempt(views.loadVaccineTime), name='loadVaccineTime'),
    path('listmaidenbaby/',csrf_exempt(views.listmaidenbaby), name='listmaidenbaby'),
    path('listVaccVisit/',csrf_exempt(views.listVaccVisit), name='listVaccVisit'),
    path('saveImmunization/',views.saveImmunization, name='saveImmunization'),
    path('saveImmEffect/',views.saveImmEffect, name='saveImmEffect'),
    path('savemaidenpncVisit/',views.savemaidenpncVisit, name='savemaidenpncVisit'),
    path('savebabypncVisit/',views.savebabypncVisit, name='savebabypncVisit'),
    path('administerFp/',views.administerFp, name='administerFp'),
    path('saveFpEffect/',views.saveFpEffect, name='saveFpEffect'),
    path('discontinueFp/',views.discontinueFp, name='discontinueFp'),
    path('listfpPlan/',csrf_exempt(views.listfpPlan), name='listfpPlan'),
    

    ############ special clinics #################
    path('conspecialpage/',views.conspecialpage, name='conspecialpage'),
    path('savespnotes/',views.savespnotes, name='savespnotes'),

    ###############################report loading##########################
    
    path('consult_report/',views.consult_report, name='consult_report'),

    ######## eye consultation ######################
    path('consult_eye/',views.consult_eye_page, name='consult_eye'),
    path('waitlist_eye/',csrf_exempt(views.waitlist_eye), name='waitlist_eye'),
    path('eye_diagnosis_entry/',csrf_exempt(views.check_eyediagnosis_entry), name='eye_diagnosis_entry'),
    path('save_sp_request/',csrf_exempt(views.save_special_request), name='save_sp_request'),


    ############# dental cunsutaion urls ############################
    path('consult_dental/',views.consult_dental, name='consult_dental'),
    path('waitlist_dental/',csrf_exempt(views.waitlist_dental), name='waitlist_dental'),
    path('save_dental_notes/',csrf_exempt(views.SaveDentalNotes), name='save_dental_notes'),

      ############# theater bookings urls ############################ 

    path('booktheater/',views.booktheater, name='booktheater'),
    path('saveTHBook/',csrf_exempt(views.saveTHBook), name='saveTHBook'),
    path('booklist/',csrf_exempt(views.booklist), name='booklist'),


   ############# notify death urls ############################ 

    path('notify_death/',views.notify_death, name='notify_death'),    
    path('saveNotification/',csrf_exempt(views.saveNotification), name='saveNotification'),


]