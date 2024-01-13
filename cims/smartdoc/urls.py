"""smartdoc URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('sysadmin/', include('sysadmin.urls')),
    path('records/', include('MedicalRecords.urls')),
    path('consult/', include('consultation.urls')),
    path('lab/', include('laboratory.urls')),
    path('rad/', include('radiology.urls')),
    path('pharm/', include('pharmacy.urls')),
    path('nurse/', include('nursing.urls')),
    path('finance/', include('finance.urls')),
    path('stores/', include('stores.urls')),
    path('reports/', include('reports.urls')),
    path('user/', include('systemusers.urls')),
    path('crm/', include('crm.urls')),
    path('farewell/', include('farewell.urls')),
    path('hr/', include('HR.urls')),
    path('pho/', include('pho.urls')),
    path('gatepass/', include('Gatepass.urls')),
]

