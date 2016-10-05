from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext as _
from userena.models import UserenaBaseProfile

class AndiUserProfile(UserenaBaseProfile):
    user = models.OneToOneField(User,
                                unique=True,
                                verbose_name=_('user'),
                                related_name='andi_user_profile')

class AllowedMailDomain(models.Model):
    domain = models.CharField(max_length=50)

    def __str__(self):
        return self.domain


class AllowedEMailAddress(models.Model):
    email = models.CharField(max_length=75)

    def __str__(self):
        return self.email
