FROM python:3.5-onbuild

# necessary system level dependencies
RUN apt-get update && apt-get install -y \
  libffi-dev

# install nodejs
ENV NODE_VERSION="v6.7.0"
RUN curl -LO http://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION-linux-x64.tar.gz
RUN tar xzf node-$NODE_VERSION-linux-x64.tar.gz
RUN cp -rp node-$NODE_VERSION-linux-x64 /usr/local/
RUN ln -s /usr/local/node-$NODE_VERSION-linux-x64 /usr/local/node
ENV PATH $PATH:/usr/local/node/bin

WORKDIR /usr/src/app
RUN npm install
RUN npm install -g bower
RUN bower install --allow-root

COPY ./Docker/gunicorn_start /usr/src/app/
RUN chmod u+x /usr/src/app/gunicorn_start
