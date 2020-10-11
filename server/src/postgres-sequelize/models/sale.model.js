'use strict';

const User = require('./user.model');
const History = require('./history.model');
const PaymentMethod = require('./payment-method.model');

const { DataTypes } = require('sequelize');
const sequelize = require('../../loaders/databases/postgres-sequelize');

const Sale = sequelize.define(
  'sale',
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
    customer: {
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

Sale.belongsTo(User, { foreignKey: 'sellerId' });
Sale.belongsTo(PaymentMethod);
Sale.hasMany(History);

module.exports = Sale;
