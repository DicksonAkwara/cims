from django.urls import path
from . import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('',  views.nurse_index, name='nurse-index'),
    path('nurse_triage/',  views.nurse_triage, name='triage-desk'),
    path('nurse_ip_triage/',  views.nurse_ip_triage, name='nurse_ip_triage'),
    path('stations/',  csrf_exempt(views.stations), name='stations'),
    path('inpatient_list/',  csrf_exempt(views.inpatient_list), name='inpatient_list'),
    path('outpatient_list/',  csrf_exempt(views.outpatient_list), name='outpatient_list'),
    path('check_cons_payment/',  csrf_exempt(views.check_cons_payment), name='check_cons_payment'),
    path('save_triage/', csrf_exempt(views.save_triage), name='save-triage'),
    path('nurse_ops/',  views.nurse_ops, name='nurse_ops'),   
    path('nurse_reff/',  views.nurse_referral, name='nurse_reff'),
    path('nurse_adm/',  views.nurse_adm, name='nurse_adm'),
    path('nurse_ip_ops/',  views.nurse_ip_ops, name='nurse_ip_ops'),
    path('theater_adm/',  views.theater_adm, name='theater_adm'),
    path('theatre_checklist/',  views.theatre_checklist, name='theatre_checklist'),
    path('theatre_bill/',  views.theatre_bill, name='theatre_bill'),
    path('theatre_services/',  views.theatre_services, name='theatre_services'),
    path('nurse_report/',  views.nurse_report, name='nurse_report'),
    path('theatre_discharge/',  views.theatre_discharge, name='theatre_discharge'),
    path('triagelist/',  csrf_exempt(views.triagelist), name='triagelist'),
    path('doctorequest/',  csrf_exempt(views.doctorequest), name='doctorequest'),
    path('servicesearch/',  csrf_exempt(views.servicesearch), name='servicesearch'),
    path('administer/',  csrf_exempt(views.administer), name='administer'),
    path('opraisebill/',  csrf_exempt(views.opraisebill), name='opraisebill'),
    path('search_receipt/',  csrf_exempt(views.search_receipt), name='search_receipt'),

    ############# nurse cardex ##########################   

    path('nurse_cardex/',  views.nurse_cardex, name='nurse_cardex'),
    path('save_cardex/',   csrf_exempt(views.save_cardex), name='save_cardex'),
    path('cardex_notes/',   csrf_exempt(views.cardex_notes), name='cardex_notes'),

    ############## discharge ##################################  
    path('nurse_disch/',  views.nurse_disch, name='nurse_disch'),
    path('dischlist/',   csrf_exempt(views.discharge_list), name='dischlist'),
    
]