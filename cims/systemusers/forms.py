from django import forms
from .models import CustomUser
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User, Group



class CreateUserForm(UserCreationForm):
    email = forms.EmailField()
    class Meta:
        model = CustomUser
        #fields = '__all__'
        fields = ['fullname', 'national_Id_No', 'email','phone','department','user_type','username', 'password1', 'password2']
        help_texts = {
            'username': None,
            'email': None,
            'password1': None,
            'password2': None,
        }
    
