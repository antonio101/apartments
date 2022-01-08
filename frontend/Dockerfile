FROM node:16-alpine

COPY package.json /data/
WORKDIR /data/
RUN npm install
ENV PATH /data/node_modules/.bin:$PATH

COPY . /data/app/
WORKDIR /data/app/

RUN npm run build
ENTRYPOINT npm start