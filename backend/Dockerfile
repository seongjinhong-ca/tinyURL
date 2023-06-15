#FROM ubuntu:20.04
FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /tinyurl-gitrepo/backend
#COPY . /tinyurl-gitrepo
#COPY ["/backend", "/client", "./"]
#RUN apt-get update && npm install
COPY . .
RUN npm install --production

CMD ["npm", "run", "dockerize"]
EXPOSE 3400