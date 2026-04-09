FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY . .

ENV PORT=3210
EXPOSE 3210

CMD ["npm", "start"]
