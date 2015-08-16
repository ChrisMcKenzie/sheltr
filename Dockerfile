FROM node:0.12

WORKDIR /src
ADD . /src
RUN npm install
CMD ["/src/bin/www"]
