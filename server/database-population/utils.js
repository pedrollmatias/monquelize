'use strict';

const { mongodbMongooseDb, postgresSequelizeDb } = require('../src/loaders/databases');

async function dbConnect() {
  await mongodbMongooseDb.connect();
  await postgresSequelizeDb.connect();
}

function dbDisconnect() {
  mongodbMongooseDb.disconnect();
  postgresSequelizeDb.disconnect();
}

function clearMongodbMongooseCollections() {
  return mongodbMongooseDb.clearCollections();
}

function clearPostrgresSequelizeTables() {
  const sequelize = postgresSequelizeDb.sequelize;

  return sequelize.sync({ force: true });
}

function generateRandomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomFloat(min, max) {
  return Number((Math.random() * (max - min + 1) + min).toFixed(2));
}

function generateSKU(datetime) {
  return datetime.toString(16).split('').join('').toUpperCase();
}

function appendSku(products) {
  const baseDatetime = Date.now();

  return products.map((product, i) => ({
    ...product,
    sku: generateSKU(baseDatetime + i),
  }));
}

module.exports = {
  appendSku,
  clearMongodbMongooseCollections,
  clearPostrgresSequelizeTables,
  dbConnect,
  dbDisconnect,
  generateRandomInteger,
  generateRandomFloat,
};
