FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY package.json package-lock.json ./
RUN npm install

COPY . .
CMD ["npm", "start"]