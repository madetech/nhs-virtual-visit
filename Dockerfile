# base image
FROM node:12.16.1

# Create & set app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# copy source files
COPY . /usr/src/app

# insall dependencies
RUN npm install

# start app
RUN npm build
EXPOSE 3000
CMD npm start