'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../../loaders/databases/postgres-sequelize');

const Unit = sequelize.define(
  'Unit',
  {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortUnit: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    decimalPlaces: {
      type: DataTypes.INTEGER,
    },
  },
  {
    modelName: 'Units',
    indexes: [
      {
        unique: true,
        fields: ['unit'],
      },
    ],
  }
);

module.exports = Unit;
