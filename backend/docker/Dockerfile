FROM node:alpine3.22

COPY ../package.json /app/package.json
WORKDIR /app

RUN npm install
RUN npx prisma generate

RUN echo 'Image Built - docker-nodejs'
CMD [ "npm", "run", "dev" ]