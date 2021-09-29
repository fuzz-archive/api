FROM node:alpine

WORKDIR /ovo/opt/

RUN apk update

COPY . .
RUN yarn
RUN yarn build

RUN rm -rf src
RUN yarn cache clean

ENTRYPOINT ["node", "."]
