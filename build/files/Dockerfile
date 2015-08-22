## DO NOT RUN THIS FROM PROJECT ROOT THIS IS COPIED BY BUILD
## SYSTEM
FROM node:0.12

ADD . /opt/app
ADD package.json /tmp/package.json
RUN cd /tmp && npm install --production
RUN cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app
CMD node app.js
