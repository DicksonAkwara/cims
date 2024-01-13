from django.contrib import admin

from .models import *
# Register your models here.
admin.site.register(LabTestParameter),
admin.site.register(labDepartment)
admin.site.register(LabDepartmentTest)
