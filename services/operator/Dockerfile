FROM node:8
RUN mkdir -p /usr/src/ns-backend/core
WORKDIR /usr/src/ns-backend/core
COPY package.json /usr/src/ns-backend/core
RUN npm install
COPY . /usr/src/ns-backend/core
EXPOSE 4001
CMD [ "npm", "start" ]