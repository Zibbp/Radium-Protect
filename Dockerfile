FROM mhart/alpine-node:12

RUN apk add --no-cache python make g++

# create destination directory
WORKDIR /opt/app

COPY package.json package-lock.json* ./

# copy the app, note .dockerignore
RUN npm install

COPY . /opt/app

# expose 3000 on container
EXPOSE 7090

# start the app
CMD [ "npm", "start" ]