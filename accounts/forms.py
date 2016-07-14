from django import forms
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext as _

from userena.forms import SignupFormTos

from .models import AllowedMailDomain

class MailDomainValidationForm(SignupFormTos):
    def __init__(self, *args, **kwargs):
        super(SignupFormTos, self).__init__(*args, **kwargs)

    def clean_email(self):
        """Add test to see whether email domain is allowed.
        """
        # do validations that already have been specified
        super(SignupFormTos, self).clean_email()

        data = self.cleaned_data['email']

        whitelist = [d.domain for d in AllowedMailDomain.objects.all()]
        domain = data.split('@')[1]
        if not domain in whitelist:
            raise ValidationError(
                _('Registration not allowed for email addresses from domain "%(domain)s".'),
                code='invalid',
                params={'domain': domain},
            )

        return data
