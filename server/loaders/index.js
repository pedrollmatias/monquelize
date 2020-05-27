'use strict';

const expressLoader = require('./express');
const mongooseLoader = require('./mongoose');
const Logger = require('./logger');

module.exports = async (expressApp, server) => {
  if (server.id === 'mongodb-mongoose') {
    await mongooseLoader(server.databaseURL);
    Logger.info(`Database "${server.name}" loaded and connected`);
  }

  expressLoader(expressApp, server.id);
  Logger.info('Express loaded');
};
