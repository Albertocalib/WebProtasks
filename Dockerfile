FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
COPY angular.json ./
COPY tsconfig.json ./
COPY src/ ./src/
COPY proxy.conf*.json ./
COPY karma.conf.js ./

# update alpine system and install dependencies to install canvas dependencies in npm install
RUN apk update
RUN apk add --no-cache \
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

COPY --chown=node:node . /usr/src/app
RUN npm install --ignore-scripts
RUN npm run build --prod

EXPOSE 4200
USER node
CMD [ "npm" , "run" , "serve-docker" ]
