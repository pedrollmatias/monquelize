'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../../loaders/databases/postgres-sequelize');

const historyEnum = {
  '100': 'Input',
  '200': 'Output',
  '300': 'Adjustment',
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
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = History;
