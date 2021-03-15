'use strict';

const expressLoader = require('./express');
const { mongodbMongooseDb, postgresSequelizeDb } = require('./databases');
const Logger = require('./logger');

require('../modules/sequelize-model-register/register');

module.exports = async (app, serverId, serverName) => {
  Logger.info(`Stablishing connection with database of server "${serverName}"...`);

  switch (serverId) {
    case 'mongodb-mongoose':
      await mongodbMongooseDb.connect();
      break;
    case 'postgres-sequelize': {
      await postgresSequelizeDb.connect();

      const sequelize = postgresSequelizeDb.sequelize;

      // await sequelize.sync({ force: true });
      await sequelize.sync({ alter: { drop: false } });

      break;
    }
    default:
      throw new Error(`Can't stablish connection with database of server ${serverId}`);
  }

  Logger.info(`Server "${serverName}" database loaded and connected`);

  expressLoader(app, serverId);
  Logger.info('Express loaded');
};
