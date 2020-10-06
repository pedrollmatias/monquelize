'use strict';

const expressLoader = require('./express');
const { mongodbMongooseDb, postgresSequelizeDb } = require('./databases');
const sequelizeSync = require('../modules/postgres-sequelize-sync/sync');
const Logger = require('./logger');

module.exports = async (app, serverId, serverName) => {
  Logger.info(`Stablishing connection with database of server "${serverName}"...`);

  switch (serverId) {
    case 'mongodb-mongoose':
      await mongodbMongooseDb;
      break;
    case 'postgres-sequelize':
      await postgresSequelizeDb;
      await sequelizeSync({ force: true });
      // await sequelizeSync({ alter: { drop: false } });
      break;
    default:
      throw new Error(`Can't stablish connection with database of server ${serverId}`);
  }

  Logger.info(`Server "${serverName}" database loaded and connected`);

  expressLoader(app, serverId);
  Logger.info('Express loaded');
};
