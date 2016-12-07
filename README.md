# ANDI-frontend

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.12.1.

## Installation

Install [nodejs](https://nodejs.org/en/download/) (or via
  [package manager](https://nodejs.org/en/download/package-manager/)) and npm
```
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install npm
```

Install [bower](https://bower.io/#install-bower)
```

```
Install [Python 3](https://www.python.org/downloads/) and other requirements
```
sudo apt-get install python3
sudo apt-get install python3-dev libffi-dev
```

Install [pip](https://pip.pypa.io/en/stable/installing/)
```
sudo apt-get install python-pip
```

Install [virtualenv](https://virtualenv.pypa.io/en/stable/installation/)
```
sudo apt-get install virtualenv
```

Install [Docker](https://docs.docker.com/engine/installation/)
```
sudo apt-get install docker.io
```

Clone repository
```
git clone https://github.com/andi-nl/ANDI-frontend.git
cd ANDI-frontend
```

Make and activate virtualenv
```
virtualenv -p python3 venv
source venv/bin/activate
```
The virtualenv should use Python 3.

**Please note that using a virtual environment is required!**
If you get the `no module named Image` error, you're not using a (clean) virtual environment.

Run
- `npm install` to install node modules
- `bower install` to install bower components

Install Python requirements
```
pip install -r requirements.txt
```

Change local settings
```
cp ANDI/local_settings.example.py ANDI/local_settings.py
```

Adjust this file according to your local settings. You can update the `DEFAULT_FROM_EMAIL`
to your own email address. The `OCPU_HOST` should be a string containing the IP address
reported by the OCPU docker (see below).

Initialize database
```
python manage.py migrate
```

Add userena permissions
```
python manage.py check_permissions
```

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

Run the mailserver, ocpu service, and webserver each in their own terminal.

Start dummy mailserver for activation email (the email is not really send, but printed in the terminal)

```
python -m smtpd -n -c DebuggingServer localhost:1025
```

Start ocpu service

```
docker run -t -p 80:80 -p 8004:8004 andinl/andiocpu
```

Go to the ANDI-frontend folder and activate virtualenv (if you haven't done so yet)

```
cd ANDI-frontend
source venv/bin/activate
```

And (in the same terminal) start the Django app

```
python manage.py runserver
```

The ANDI app can be found at: http://localhost:8000/

The admin module can be found at: http://localhost:8000/admin/
You can log into the admin module with the superuser created earlier.
