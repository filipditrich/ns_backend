FROM node:8
RUN mkdir -p /usr/src/ns-backend/operator
WORKDIR /usr/src/ns-backend/operator
COPY package.json /usr/src/ns-backend/operator
RUN npm install
COPY . /usr/src/ns-backend/operator
EXPOSE 4000
CMD [ "npm", "run-script", "start:prod" ]