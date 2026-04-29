FROM node:alpine3.22

COPY ../quote-resume/package.json /app/package.json
WORKDIR /app

RUN npm install
RUN npm install -g react-scripts

RUN echo 'Image Built - docker-react'
CMD ["npm", "run", "dev"]