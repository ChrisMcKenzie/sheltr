FROM node:0.12
MAINTAINER Chris McKenzie <chris@chrismckenzie.io>

COPY dist/ package.json /opt/app/

RUN cd /opt/app && npm install --production

EXPOSE 3000

WORKDIR /opt/app
CMD node app.js
