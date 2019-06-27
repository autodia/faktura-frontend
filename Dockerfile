#########################
### build environment ###
#########################

# base image
FROM node as builder

# set working directory
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# add app
COPY . /usr/src/app

# install and cache app dependencies
RUN npm install
RUN npm install -g @angular/cli

# build environment var
ARG env

RUN echo "$env"

# generate build
RUN ng build --prod --c="$env"

##################
### production ###
##################

# base image
FROM nginx:1.13.9-alpine

# Remove default nginx configs
RUN rm -f /etc/nginx/conf.d/*

# Add project configuration files
COPY nginx/configs/* /etc/nginx/conf.d/

# copy artifact build from the 'build environment'
COPY --from=builder /usr/src/app/dist/frontend/* /usr/src/app/

EXPOSE 80 8000

COPY start.sh .
RUN chmod +x start.sh
ENTRYPOINT [ "./start.sh" ]
