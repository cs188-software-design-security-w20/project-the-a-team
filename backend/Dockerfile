FROM node:12-buster

COPY . /opt/app/
RUN apt-get update && \
    apt-get install -y --no-install-recommends pdftk && \
    rm -rf /var/lib/apt/lists/* && \
    cd /opt/app && \
    yarn
WORKDIR /opt/app
USER node
EXPOSE 8080
CMD ["node", "index.js"]
