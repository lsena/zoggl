FROM node:latest
RUN apt-get update && apt-get install -y curl

RUN mkdir /code
ADD . /code/
RUN curl https://install.meteor.com/ | sh
WORKDIR code/
CMD ["meteor"]

RUN chown -R node:node /code