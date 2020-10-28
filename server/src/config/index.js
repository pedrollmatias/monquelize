'use strict';

const path = require('path');
const dotenv = require('dotenv');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config({ path: path.join(__dirname, '../../../.env') });

if (envFound.error) {
  throw new Error('Could not find .env file');
}

module.exports = {
  servers: {
    'mongodb-mongoose': {
      name: 'MongoDB with Mongoose',
      port: parseInt(process.env.PORT_MONGODB_MONGOOSE, 10),
      databaseURL: process.env.MONGODB_MONGOOSE_URI,
    },
    'postgres-sequelize': {
      name: 'Postgres with Sequelize',
      port: parseInt(process.env.PORT_POSTGRES_SEQUELIZE, 10),
      databaseURL: process.env.POSTGRES_SEQUELIZE_URI,
    },
  },
  logs: { level: process.env.LOG_LEVEL || 'silly' },
  api: { prefix: '/api' },
};
