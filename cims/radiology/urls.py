from django.urls import path
from . import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('',  views.rad_index, name='rad-index'),
    path('rad_reception/',  views.rad_reception, name='rad-reception'),
    path('retrieve_request/',views.retrieve_request, name='retrieve-request'),
    path('retrievepatreq/',views.retrieveptreq, name='retrievepatreq'),
    path('cash_bill_service/', views.cash_bill_service, name='cash-bill-service'),    
    path('paid_service/',views.paid_service, name='paid-service'),
    path('missreason/',views.record_miss_reason, name='missreason'),
    path('refresh_list/',views.refresh_list, name='refresh-list'),
    path('compexam/',views.complete_exam, name='compexam'),
    path('compdateexam/',views.complete_date_exam, name='compdateexam'),
    path('refresh_list_pat/', csrf_exempt(views.refresh_list_pat), name='refresh-list-pat'),
    path('record_notes/', views.record_notes, name='record-notes'),
    path('search_exam_notes/', csrf_exempt(views.search_exam_notes), name='search_exam_notes'),
    path('consResultSearch/', csrf_exempt(views.consResultSearch), name='consResultSearch'),
    path('trynotes/', csrf_exempt(views.trynotes), name='trynotes'),
    path('rtv_notes/', csrf_exempt(views.rtv_notes), name='rtv_notes'),
    path('manualbill/',  views.manualbill, name='manualbill'),
    path('radSearchService/', csrf_exempt(views.radSearchService), name='radSearchService'),


    ############### settings ##############################
    path('servicelist/',  views.servicelist, name='servicelist'),
    path('new_service/', csrf_exempt(views.new_service), name='new_service'),
    path('update_service/', csrf_exempt(views.update_service), name='update_service'),


    ############### reports ##############################
    path('rad_report/',  views.rad_report, name='rad_report'),


]