from django import forms
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext as _

from userena.forms import SignupFormTos

from django.conf import settings

from .models import AllowedMailDomain, AllowedEMailAddress


class MailDomainValidationForm(SignupFormTos):
    def __init__(self, *args, **kwargs):
        super(SignupFormTos, self).__init__(*args, **kwargs)

    def clean_email(self):
        """Add test to see whether email domain is allowed.
        """
        # do validations that already have been specified
        super(SignupFormTos, self).clean_email()

        data = self.cleaned_data['email']

        domain_whitelist = [d.domain for d in AllowedMailDomain.objects.all()]
        domain = data.split('@')[1]
        if not domain in domain_whitelist:
            email_whitelist = [e.email
                               for e in AllowedEMailAddress.objects.all()]
            if not data in email_whitelist:
                msg = 'Registration not allowed for "%(email)s".\n' + \
                      'Please send an email to %(adminemail)s to request an ' \
                      'account for the ANDI portal.'
                raise ValidationError(
                    _(msg), code='invalid',
                    params={'email': data,
                            'adminemail': settings.ADMIN_EMAIL_ADDRESS},
                )

        return data
