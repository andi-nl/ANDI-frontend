# Server setup on Ubuntu 14.04

This setup includes:
* [Django](https://www.djangoproject.com/) Web Framework,
* [Gunicorn](http://gunicorn.org/) Application Server,
* [Supervisor](http://supervisord.org/) Process Controll System,
* [Nginx](https://www.nginx.com/) Web Server
* [Postfix](http://www.postfix.org/) Mail Server.

## Update system
```
$ sudo apt-get update
$ sudo apt-get upgrade -y
```

## Application user
```
$ sudo groupadd --system webapps
$ sudo useradd --system --gid webapps --shell /bin/bash --home /webapps/andi_app andi
```

## Create virtual environment

### Install virtualenv
```
$ sudo apt-get install -y python-virtualenv
```

### setup directories and environment
```
$ sudo mkdir -p /webapps/andi_app/
$ sudo chown andi /webapps/andi_app/
$ sudo su - andi
$ cd /webapps/andi_app/
$ virtualenv .
$ source bin/activate
```

## Get the andi-frontend code
```
$ sudo apt-get install -y git
$ git clone https://github.com/andi-nl/ANDI-frontend.git
```

## install system level dependencies
```
$ sudo apt-get install -y zlib1g-dev libjpeg-dev build-essential python-dev
```

## install Python dependencies
```
$ pip install -r ANDI-frontend/requirements.txt
```

## setting-up permissions
```
$ sudo chown -R andi:users /webapps/andi_app
$ sudo chmod -R g+w /webapps/andi_app
$ sudo usermod -a -G users `whoami`
```

## Gunicorn
```
$ pip install gunicorn
```

### Gunicorn start script
```
$sudo apt-get install -y nano`
$ nano webapps/andi_app/bin/gunicorn_start`
```

```
 #!/bin/bash

NAME="andi_app"                                  # Name of the application
DJANGODIR=/webapps/andi_app/ANDI-frontend        # Django project directory
SOCKFILE=/webapps/andi_app/run/gunicorn.sock     # we will communicte using this unix socket
USER=andi                                        # the user to run as
GROUP=webapps                                    # the group to run as
NUM_WORKERS=3                                    # how many worker processes should Gunicorn spawn
DJANGO_SETTINGS_MODULE=ANDI.settings             # which settings file should Django use
DJANGO_WSGI_MODULE=ANDI.wsgi                     # WSGI module name

echo "Starting $NAME as `whoami`"

# Activate the virtual environment
cd $DJANGODIR
source ../bin/activate
export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
export PYTHONPATH=$DJANGODIR:$PYTHONPATH

# Create the run directory if it doesn't exist
RUNDIR=$(dirname $SOCKFILE)
test -d $RUNDIR || mkdir -p $RUNDIR

# Start your Django Unicorn
# Programs meant to be run under supervisor should not daemonize themselves (do not use --daemon)
exec ../bin/gunicorn ${DJANGO_WSGI_MODULE}:application \
  --name $NAME \
  --workers $NUM_WORKERS \
  --user=$USER --group=$GROUP \
  --bind=unix:$SOCKFILE \
  --log-level=debug \
  --log-file=-
```

### set permissions
```
$ sudo chown andi bin/gunicorn_start
$ sudo chmod u+x bin/gunicorn_start
```
## Supervisor
### config
```
$ sudo apt-get install -y supervisor
$ sudo service supervisor start
$ sudo nano /etc/supervisor/conf.d/andi.conf
```

```
[program:andi]
command = /webapps/andi_app/bin/gunicorn_start                       ; Command to start app
user = andi                                                          ; User to run as
stdout_logfile = /webapps/andi_app/logs/gunicorn_supervisor.log      ; Where to write log messages
redirect_stderr = true                                               ; Save stderr in the same log
environment=LANG=en_US.UTF-8,LC_ALL=en_US.UTF-8                      ; Set UTF-8 as default encoding
```
### logging
```
$ mkdir -p /webapps/andi_app/logs/
$ touch /webapps/andi_app/logs/gunicorn_supervisor.log
```
### run
```
$ sudo supervisorctl reread
$ sudo supervisorctl update
$ sudo supervisorctl start andi     # supervisorctl (start/stop/restart) andi
```

## Nginx

### install & run
```
$ sudo apt-get install -y nginx
$ sudo service nginx start
```

### setup
```
$ sudo nano /etc/nginx/sites-available/andi
```

```
upstream andi_app_server {
  # fail_timeout=0 means we always retry an upstream even if it failed
  # to return a good HTTP response (in case the Unicorn master nukes a
  # single worker for timing out).

  server unix:/webapps/andi_app/run/gunicorn.sock fail_timeout=0;
}

server {

    listen   80;
    server_name andi-smtp.andi-nlesc.vm.surfsara.nl;

    client_max_body_size 4G;

    access_log /webapps/andi_app/logs/nginx-access.log;
    error_log /webapps/andi_app/logs/nginx-error.log;

    location /static/ {
        alias   /webapps/andi_app/ANDI-frontend/static/;
    }

    location /media/ {
        alias   /webapps/andi_app/ANDI-frontend/media/;
    }

    location / {
        # an HTTP header important enough to have its own Wikipedia entry:
        #   http://en.wikipedia.org/wiki/X-Forwarded-For
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # enable this if and only if you use HTTPS, this helps Rack
        # set the proper protocol for doing redirects:
        # proxy_set_header X-Forwarded-Proto https;

        # pass the Host: header from the client right along so redirects
        # can be set properly within the Rack application
        proxy_set_header Host $http_host;

        # we don't want nginx trying to do something clever with
        # redirects, we set the Host: header above already.
        proxy_redirect off;

        # set "proxy_buffering off" *only* for Rainbows! when doing
        # Comet/long-poll stuff.  It's also safe to set if you're
        # using only serving fast clients with Unicorn + nginx.
        # Otherwise you _want_ nginx to buffer responses to slow
        # clients, really.
        # proxy_buffering off;

        # Try to serve static files from nginx, no point in making an
        # *application* server like Unicorn/Rainbows! serve static files.
        if (!-f $request_filename) {
            proxy_pass http://andi_app_server;
            break;
        }
    }

    # Error pages
    error_page 500 502 503 504 /500.html;
    location = /500.html {
        root /webapps/andi_app/ANDI-frontend/static/;
    }
}
```

```
$ sudo ln -s /etc/nginx/sites-available/andi /etc/nginx/sites-enabled/andi
$ sudo rm /etc/nginx/sites-enabled/default # otherwise the default will be served
$ sudo service nginx restart
```
---
with help from
[bog post by Michal Karzynski](http://michal.karzynski.pl/blog/2013/06/09/django-nginx-gunicorn-virtualenv-supervisor/)
