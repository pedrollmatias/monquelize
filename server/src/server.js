'use strict';

const { servers } = require('./config');
const express = require('express');
const Logger = require('./loaders/logger');

async function startServer() {
  for (const key of Object.keys(servers)) {
    const app = express();

    await require('./loaders')(app, key, servers[key].name);

    app.listen(servers[key].port, (err) => {
      if (err) {
        Logger.error(err);
        process.exit(1);
      }
      Logger.info(`"${servers[key].name}" server listening on port ${servers[key].port}`);
    });
  }
}

(async () => await startServer())();
