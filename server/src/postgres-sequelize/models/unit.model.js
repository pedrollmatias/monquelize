'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../../loaders/databases/postgres-sequelize');

const Unit = sequelize.define(
  'unit',
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
    indexes: [
      {
        unique: true,
        fields: ['unit'],
      },
    ],
  }
);

module.exports = Unit;
