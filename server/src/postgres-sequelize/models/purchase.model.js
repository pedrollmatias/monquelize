'use strict';

const { DataTypes } = require('sequelize');
const User = require('./user.model');
const sequelize = require('../../loaders/databases/postgres-sequelize');
const PaymentMethod = require('./payment-method.model');

const purchaseStatusEnum = {
  '100': 'Draft',
  '300': 'Done',
  '400': 'Canceled',
};

const Purchase = sequelize.define(
  'purchase',
  {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      enum: Object.keys(purchaseStatusEnum),
      defaultValue: '100',
    },
    customer: {
      type: DataTypes.STRING,
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

Purchase.hasOne(User);
Purchase.hasOne(PaymentMethod);

module.exports = Purchase;
