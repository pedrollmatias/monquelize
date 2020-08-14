'use strict';

const { servers } = require('../../config');
const Sequelize = require('sequelize');

module.exports = new Sequelize(servers['postgres-sequelize'].databaseURL);
