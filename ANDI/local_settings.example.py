# SECURITY WARNING: keep the secret key used in production secret!
# To generate a key in python:
# import os
# import binascii
# binascii.hexlify(os.urandom(50))
SECRET_KEY = '-(%*&koiplct1vfmiy_aovb@*ncmggq#$s%vi2b4ql8za=k2!#'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

# domain the ANDI application is hosted on, e.g., www.andi.nl
DOMAIN = 'localhost:8000'

# email settings

# email address account activation mails are send from and potential users can
# use to request an account
ADMIN_EMAIL_ADDRESS = ''

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'localhost'
EMAIL_PORT = 25
EMAIL_USE_TLS = False
DEFAULT_FROM_EMAIL = 'ANDI Application Admin <{}>'.format(ADMIN_EMAIL_ADDRESS)

# open cpu settings

# Just the ip-address/domain
OCPU_HOST = 'http://145.100.116.11'
