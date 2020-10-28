'use strict';

const User = require('./user.model');
const History = require('./history.model');
const PaymentMethod = require('./payment-method.model');

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../loaders/databases/postgres-sequelize');

const Purchase = sequelize.define(
  'purchase',
  {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    timestamp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    vendor: {
      type: DataTypes.STRING,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['_id'],
      },
    ],
  }
);

Purchase.belongsTo(User, { foreignKey: 'buyerId' });
Purchase.belongsTo(PaymentMethod);
Purchase.hasMany(History);

module.exports = Purchase;
