'use strict';

const config = require('./config');
const express = require('express');
const Logger = require('./loaders/logger');

async function startServer() {
  for (const server of config.servers) {
    const app = express();

    await require('./loaders')(app, server);

    app.listen(server.port, (err) => {
      if (err) {
        Logger.error(err);
        process.exit(1);
      }
      Logger.info(`"${server.name}" server listening on port ${server.port}`);
    });
  }
}

startServer();
