FROM node:18.12.1-alpine

WORKDIR /SERVER_APP

COPY package*.json .

RUN npm install

COPY . .

ENV SERVER_PORT=5001

EXPOSE $SERVER_PORT

ENV NODE_ENV=development

CMD ["sh", "-c", "npm run ${NODE_ENV}"]
