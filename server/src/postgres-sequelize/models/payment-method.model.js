'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../loaders/databases/postgres-sequelize');

const PaymentMethod = sequelize.define(
  'paymentMethod',
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
    removed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'payment_methods',
    indexes: [
      {
        unique: true,
        fields: ['name'],
      },
    ],
  }
);

module.exports = PaymentMethod;
