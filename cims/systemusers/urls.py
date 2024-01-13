from django.contrib import admin
from django.urls import path
from . import views
from django.contrib.auth import views as auth_views


urlpatterns = [
   path('register/', views.register, name='user-register'),
   path('profile/', views.user_profile, name='user-profile'),
   path('', auth_views.LoginView.as_view(template_name='dashboard/systemuser/login.html'), name='user-login'),
   path('logout/', auth_views.LogoutView.as_view(template_name='dashboard/systemuser/logout.html'), name='user-logout'),

]

"""
in login view just above redirect add
--- this help user regain original page after session expired and a view got @login_required
if 'next' in request.POST:
   return redirect(request.POST['next'])
"""   