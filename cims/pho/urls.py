from django.urls import path
from . import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [ 
    path('',  views.pho_index, name='pho_index'),
    path('search_service/',  csrf_exempt(views.search_service), name='search_service'),
    path('raisebill/',  csrf_exempt(views.raisebill), name='raisebill'),
]