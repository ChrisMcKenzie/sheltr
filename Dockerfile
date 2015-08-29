## DO NOT RUN THIS FROM PROJECT ROOT THIS IS COPIED BY BUILD
## SYSTEM
FROM node:0.12

COPY dist/ package.json /opt/app/

RUN cd /opt/app && npm install --production

EXPOSE 3000

WORKDIR /opt/app
CMD node app.js
