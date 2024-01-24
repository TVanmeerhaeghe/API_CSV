FROM node

WORKDIR /app

COPY server.js package.json ./

RUN npm i

EXPOSE 80

CMD [ "npm", "start", "server.js" ]