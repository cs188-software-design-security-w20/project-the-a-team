# Taximus Maximus

The easiest way to do easy taxes.

Taximus Maximus is a web application that automates the federal tax return calculation process. It will factor into account user income (paid vs. withheld), dependents, and filing status. For user income, it will be able to account for active income (W-2 income), passive income (interest, dividends), and portfolio income (capital gains). There will be the option for the user to download the tax return form after they fill out all the fields. With this product, we intend to target people who want to simplify the tax return process.

The system has been deployed at: https://tax.timothygu.me/

## Steps to start a local development environment

### Install Node.js 12.x

For Linux, please follow the [official instructions](https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions) to install Node.js. For Windows and macOS, please download installer from [Node.js official website](https://nodejs.org/en/download/).

Be sure to select v12.x to be consistent with our environment.

### Install the Yarn package manager

Please follow the [official guide](https://classic.yarnpkg.com/en/docs/install/).

### Install Docker and Docker Compose

Please follow the official guide of [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/install/).

### Running the frontend

Before any operations, be sure to run `yarn` at the project root directory to sync up the dependencies.

Then `cd frontend` and use `yarn start` to run the frontend in development mode. The development version of frontend will run on http://localhost:3000. To build a production version of frontend, use `yarn build`.

### Running the backend

Before any operations, be sure to run `yarn` at the project root directory to sync up the dependencies.

Then run `docker-compose up --build` at the project root directory to start the backend (along with the database). To run the backend in the background (in detached mode), use `docker-compose up --build -d`. The development version of backend will run on http://localhost:8080.

## Notes

### Differences in our development version and production version

Our development version and production version (deployed on our server) are almost the same except that:

- We use a different compose file ([`docker-compose-production.yml`](docker-compose-production-redacted.yml)), which creates one more nginx container to serve frontend static files and enable TLS and security headers
- We use a different Dockerfile (`backend/Dockerfile-production`), which sets a dedicated `USER` to be able to access the log file
- We use a different config file (`backend/config-production.json`), which:
  - sets "backendURL" to "https://api.tax.timothygu.me/"
  - sets "frontendURL" to "https://tax.timothygu.me/"
  - uses a different storage bucket
  - uses different credentials dedicated for production

### About testing with TLS 1.3

Our production version is enforcing TLS 1.3. However, as far as we know, some testing tools does not support TLS 1.3 currently. If the latest version of the tool you are trying to use does not support TLS 1.3, try to use other tools, and remember that testing in the browser developer console should always work.
