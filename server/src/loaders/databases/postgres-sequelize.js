'use strict';

const { servers } = require('../../config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(servers['postgres-sequelize'].databaseURL);

function connect() {
  return sequelize;
}

function disconnect() {
  sequelize.close();
}

module.exports = {
  sequelize,
  connect,
  disconnect,
};
