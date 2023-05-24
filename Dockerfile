FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
COPY . .
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


RUN npm install
RUN npm run build --prod

EXPOSE 4200
CMD [ "npm" , "run" , "serve-docker" ]
