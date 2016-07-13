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
# install requirements (in virtual environment if desired)
pip install -r requirements.txt

# initialize database
python manage.py migrate

# add userena permissions
python manage.py check_permissions

# run dummy mailserver for activation email (the email is not really send, but printed in the terminal)
python -m smtpd -n -c DebuggingServer localhost:1025

# create admin user (optional)
python manage.py createsuperuser

```

## Run (development mode)

```python manage.py runserver```

Admin module can be found at http://localhost:8000/admin/
