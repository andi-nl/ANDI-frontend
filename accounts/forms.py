from django import forms
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext as _

from userena.forms import SignupFormTos

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

        domain_whitelist = [d.domain.lower()
                            for d in AllowedMailDomain.objects.all()]
        domain = data.split('@')[1].lower()
        if domain not in domain_whitelist:
            email_whitelist = [e.email.lower()
                               for e in AllowedEMailAddress.objects.all()]
            email = data.lower()
            if email not in email_whitelist:
                msg = 'Registration not allowed for "%(email)s".\n' + \
                      'Please send an email to ... to request an account ' \
                      'for the ANDI application.'
                raise ValidationError(
                    _(msg), code='invalid',
                    params={'email': data},
                )

        return data
