# ANDI-frontend

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.12.1.

## Installation

Install
- [nodejs](https://nodejs.org/en/download/) (or via [package manager](https://nodejs.org/en/download/package-manager/))
- [bower](https://bower.io/#install-bower)
- [Python 3](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/en/stable/installing/)
- [virtualenv](https://virtualenv.pypa.io/en/stable/installation/)
- [Docker](https://docs.docker.com/engine/installation/)

Make and activate virtualenv

```
virtualenv <ENV NAME>
source <ENV NAME>/bin/activate
```
**Please note that using a virtual environment is required!**
If you get the `no module named Image` error, you're not using a (clean) virtual environment.

Clone repository
```
git clone https://github.com/andi-nl/ANDI-frontend.git
cd ANDI-frontend
```

Run
- `npm install` to install node modules
- `bower install` to install bower componnets


Install Python requirements
```
pip install -r requirements.txt
```

Initialize database
```
python manage.py migrate
```

Add userena permissions
```
python manage.py check_permissions
```

Change local settings
```
cp ANDI/local_settings.example.py ANDI/local_settings.py
```

Adjust this file according to your local settings.

Ceate admin user (optional)
```
python manage.py createsuperuser
```

Load list of allowed email domains

```
python manage.py loaddata fixtures/maildomains.json
```

(This list needs to be updated with correct domains.)

## Run for development

Run dummy mailserver for activation email (the email is not really send, but printed in the terminal)

```
python -m smtpd -n -c DebuggingServer localhost:1025
```

Start ocpu service

```
docker run -t -p 80:80 -p 8004:8004 andinl/andiocpu
```

Go to the ANDI-frontend folder and activate virtualenv

```
cd ANDI-frontend
source <ENV NAME>/bin/activate
```

Start Django app

```
python manage.py runserver
```

The ANDI app can be found at: http://localhost:8000/

The admin module can be found at: http://localhost:8000/admin/
You can log into the admin module with the superuser created earlier.
