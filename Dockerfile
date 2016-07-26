FROM ubuntu:16.04

MAINTAINER Mateusz Kuzak <mateusz.kuzak@gmail.com>

# install requirements
RUN apt-get update && apt-get install -y \
    python-dev \
    python-pip \
    build-essential \
    gunicorn \
    curl \
    git
RUN pip install --upgrade pip

# nodejs
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs

# create directory for app and copy the app
RUN mkdir -p /webapps/andi_app/andi-frontend/
RUN mkdir -p /webapps/andi_app/bin
COPY ./ /webapps/andi_app/andi-frontend/

# django
RUN pip install -r /webapps/andi_app/andi-frontend/requirements.txt
WORKDIR /webapps/andi_app/andi-frontend/
RUN python manage.py migrate
RUN python manage.py check_permissions

# install web app packages (nodejs, bower)
RUN npm install
RUN npm install -g bower
RUN bower --allow-root install

# gunicorn
RUN pip install gunicorn
COPY ./Docker/gunicorn_start /webapps/andi_app/bin/gunicorn_start

# set user and permisions
RUN groupadd --system webapps
RUN useradd --system --gid webapps \
    --shell /bin/bash \
    --home /webapps/andi_app/andi-frontend \
    andi
RUN chown andi /webapps/andi_app/
RUN chown andi /webapps/andi_app/bin/gunicorn_start
RUN chmod u+x /webapps/andi_app/bin/gunicorn_start

EXPOSE 8000

USER andi
CMD /webapps/andi_app/bin/gunicorn_start
