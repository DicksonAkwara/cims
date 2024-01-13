from django.urls import path
from . import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
 path('',views.gateindex,name='gateindex'),
 path('release/',views.releasepage,name='release'),
]