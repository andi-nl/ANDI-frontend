FROM python:3.5-onbuild

RUN apt-get update && apt-get install -y \
  curl

# install nodejs
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs

WORKDIR /usr/src/app
RUN npm install
RUN npm install -g bower
RUN bower install --allow-root
