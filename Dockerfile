FROM node:20-alpine

WORKDIR /app

COPY ./server/package*.json ./

RUN npm install

COPY . .


CMD ["node", "./server/app.js"]