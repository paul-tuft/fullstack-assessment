FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm install -g ts-node typescript

EXPOSE 4000

CMD ["npx", "ts-node", "server.ts"]