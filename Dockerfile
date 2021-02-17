# base image
FROM node:12.16.1

# Create & set app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# copy source files
COPY package.json /usr/src/app

# insall dependencies
RUN npm install --only=prod

COPY . /usr/src/app

# start app
ENV NODE_ENV production
RUN npm run build
EXPOSE 3000
CMD npm start