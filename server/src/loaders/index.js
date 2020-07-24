'use strict';

const expressLoader = require('./express');
const mongooseLoader = require('./mongoose');
const Logger = require('./logger');

module.exports = async (expressApp, server) => {
  Logger.info(`Stablishing connection with database of server "${server.name}"...`);
  if (server.id === 'mongodb-mongoose') {
    await mongooseLoader(server.databaseURL);
    Logger.info(`Server "${server.name}" database loaded and connected`);
  }

  expressLoader(expressApp, server.id);
  Logger.info('Express loaded');
};
