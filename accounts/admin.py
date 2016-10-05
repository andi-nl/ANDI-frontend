from django.contrib import admin

from .models import AllowedMailDomain, AllowedEMailAddress

admin.site.register(AllowedMailDomain)
admin.site.register(AllowedEMailAddress)
