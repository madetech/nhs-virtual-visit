FROM node:12.16
WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install

COPY . .
RUN yarn test

#RUN yarn test:contract
RUN yarn build

# part of me wants to run unit and contract tests here
EXPOSE 3000 3001
CMD [ "yarn", "start" ]
