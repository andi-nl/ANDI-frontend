# andi

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.12.1.

## Build & development

After cloning this repository

Run `npm install` to install node modules

Run `bower install` to install bower componnets

Run `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.
# ANDI-frontend

[![Build Status](https://travis-ci.org/NLeSC/ANDI-frontend.svg)](https://travis-ci.org/NLeSC/ANDI-frontend)

# Django

## Installation

```
# clone repository
# make and activate virtual environment
# using a virtual environment is required!
# if you get the `no module named Image` error, you're not using a (clean) virtual environment

# install requirements
pip install -r requirements.txt

# initialize database
python manage.py migrate

# add userena permissions
python manage.py check_permissions

# change local settings
cp ANDI/local_settings.example.py ANDI/local_settings.py

# adjust this file according to your local settings

# create admin user (optional)
python manage.py createsuperuser

# load list of allowed email domains
# (this list needs to be updated with correct domains)
python manage.py loaddata fixtures/maildomains.json

# For development
# run dummy mailserver for activation email (the email is not really send, but printed in the terminal)
python -m smtpd -n -c DebuggingServer localhost:1025

```

## Run (development mode)

```python manage.py runserver```

Admin module can be found at http://localhost:8000/admin/
