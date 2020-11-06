FROM node:latest

COPY . /src

WORKDIR /src

RUN npm install --production
RUN npm i bcrypt

ENV APP_ID="docker"

EXPOSE 3000

CMD npm start