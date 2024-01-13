from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from .forms import CreateUserForm
from django.contrib import messages
from .models import *
from django.contrib.auth.decorators import login_required
from sysadmin.models import facdepartment
# Create your views here.


@login_required
def register(request):
    
    if request.method == 'POST':
        form = CreateUserForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f' Account for {username} created successfully')
            return redirect('user-register')
        else:
            messages.error(request, f' Account creation Failed')

    else:
        form = CreateUserForm()
        """ugroup=[]
        for i in Group.objects.all():
            ugroup.append(i.name)
        """
    users=CustomUser.objects.all()
    dept=facdepartment.objects.all()
    context = {
        'form': form,
        #'ugroup':ugroup
        'users':users,
        'dept':dept
    }
    return render(request, 'dashboard/systemuser/register.html', context)


# def user_login(request):
#    return render(request, 'user/login.html')

@login_required
def user_profile(request):
    return render(request, 'user/profile.html')

