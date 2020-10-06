'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../../loaders/databases/postgres-sequelize');

const PaymentMethod = sequelize.define(
  'PaymentMethod',
  {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    acceptChange: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    modelName: 'PaymentMethods',
    indexes: [
      {
        unique: true,
        fields: ['name'],
      },
    ],
  }
);

module.exports = PaymentMethod;
