'use strict';

const { servers } = require('../../config');
const mongoose = require('mongoose');
const models = require('../../mongodb-mongoose/models');

async function connect() {
  const connection = await mongoose.connect(servers['mongodb-mongoose'].databaseURL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

  return connection.connection.db;
}

function disconnect() {
  mongoose.connection.close();
}

async function clearCollections() {
  for (const model of Object.keys(models)) {
    await models[model].deleteMany({});
  }
}

module.exports = {
  clearCollections,
  connect,
  disconnect,
};
