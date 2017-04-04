# Setup ANDI app with docker and Docker compose

## Create and Setup Virtual Machine
Create virtual machine using Ubuntu 16.04 x64 image.

Update software

```sh
sudo apt-get udpate
sudo apt-get upgrade
```

Install Docker CE (Community Edition) by following [instructions in docker docs](https://docs.docker.com/engine/installation/linux/ubuntu/)

Install `docker-compose` by follwing [instructions in docker docs](https://docs.docker.com/compose/install/).

Activate and setup firewall.
```sh
# before activating the firewall allow for ssh trafic
sudo ufw allow ssh

# allow web trafic
sudo ufw allow www

# allow outgoing trafic
sudo ufw default allow outgoing

# activate firewall
sudo ufw enable
```

## Setup Application
Clone ANDI-frontend repository
```sh
git clone https://github.com/andi-nl/ANDI-frontend
```

### Fill in Settings for Django Application
Django application uses settings located in `ANDI/local_settings.py`. This is a Python script that uses environment variable to set some options. When run with `docker-compose` those environment variables are set in `Docker/.env` file. Example files `ANDI/local_settings.example.py` and `Docker/.env.example` are available and can be copied for use in application setup.

```sh
cp ANDI/local_settings.example.py ANDI/local_settings.py
cp Docker/.env.example Docker/.env
```
Edit `Docker/.env` file to replace values flanked by `<>` brackets with real ones reflecting your setup. Do not use quotes (' or ") around variables.

## Run Dockerised Application

Set of containers are run and connected together by `docker-compose`. This requires that `docker-compose.yml` file is in current working directory. Then whole application can be build and run in following way:
```sh
docker-compose build
docker-compose up
```

## Stop Dockerised application
To stop the application run `docker-compose down`.

## Backup and Restore Users Database
Users information is stored in `/usr/src/app/db.sqlite3` in `andifrontend_web` container. This can be saved locally and also copied into the new restarted application.

```sh
docker cp andifrontend_web_1:/usr/src/app/db.sqlite3 ./
docker cp db.sqlite3 andifrontend_web_1:/usr/src/app/db.sqlite3
```
