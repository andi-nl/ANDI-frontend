import os

# SECURITY WARNING: keep the secret key used in production secret!
# To generate a key in python:
# import os
# import binascii
# binascii.hexlify(os.urandom(50))
SECRET_KEY = '-(%*&koiplct1vfmiy_aovb@*ncmggq#$s%vi2b4ql8za=k2!#'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [os.environ['ALLOWED_HOSTS']]

# domain the ANDI application is hosted on, e.g., www.andi.nl
DOMAIN = [os.environ['DOMAIN']]

# email settings

# email address account activation mails are send from and potential users can
# use to request an account
ADMIN_EMAIL_ADDRESS = os.environ['ADMIN_EMAIL_ADDRESS']

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
EMAIL_HOST = os.environ['EMAIL_HOST']
EMAIL_PORT = os.environ['EMAIL_PORT']
EMAIL_HOST_USER = os.environ['EMAIL_HOST_USER']
EMAIL_HOST_PASSWORD = os.environ['EMAIL_HOST_PASSWORD']
EMAIL_USE_TLS = os.environ['EMAIL_USE_TLS']
DEFAULT_FROM_EMAIL = os.environ['DEFAULT_FROM_EMAIL']

# open cpu settings

OCPU_HOST = os.environ['OCPU_HOST']
OCPU_PORT = 8004
