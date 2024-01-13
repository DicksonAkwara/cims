from django.urls import path
from . import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
   path('',  views.report_page, name='mnreports'),
   path('report_name/', csrf_exempt(views.report_name), name='report_name'),
   path('generate_report/', csrf_exempt(views.generate_report), name='generate_report'),
]
