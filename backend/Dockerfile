FROM node:12-buster

RUN apt-get update && \
    apt-get install -y --no-install-recommends pdftk && \
    rm -rf /var/lib/apt/lists/*
RUN mkdir -p /opt/app
WORKDIR /opt/app

CMD node index.js
