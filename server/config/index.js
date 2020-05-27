'use strict';

const dotenv = require('dotenv');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error('Could not find .env file');
}

module.exports = {
  servers: [
    // {
    //   id: "mongodb",
    //   name: "MongoDB",
    //   port: parseInt(process.env.PORT_MONGODB, 10),
    //   databaseURL: process.env.MONGODB_URI,
    // },
    {
      id: 'mongodb-mongoose',
      name: 'MongoDB with Mongoose',
      port: parseInt(process.env.PORT_MONGODB_MONGOOSE, 10),
      databaseURL: process.env.MONGODB_MONGOOSE_URI,
    },
  ],
  logs: { level: process.env.LOG_LEVEL || 'silly' },
  api: { prefix: '/api' },
};
