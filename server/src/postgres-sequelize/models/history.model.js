'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../../loaders/databases/postgres-sequelize');

const historyEnum = {
  '100': 'Input',
  '200': 'Output',
};

const History = sequelize.define('history', {
  date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  movementType: {
    type: DataTypes.STRING,
    enum: Object.keys(historyEnum),
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = History;
