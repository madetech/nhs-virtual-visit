# FROM node:12.16
# WORKDIR /usr/src/app

# COPY package*.json ./
# RUN npm install

# COPY . .
# RUN npm run test
# #RUN yarn test:contract
# RUN npm run build

# # part of me wants to run unit and contract tests here
# EXPOSE 3000 3001
# CMD [ "npm", "run", "dev" ]


FROM node:alpine
RUN mkdir -p /usr/src
WORKDIR /usr/src
COPY . /usr/src
RUN npm install
RUN npm run build
EXPOSE 3000
CMD npm run start