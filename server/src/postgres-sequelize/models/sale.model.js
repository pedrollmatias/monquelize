'use strict';

const { DataTypes } = require('sequelize');
// const Product = require('./product.model');
// const SaleProduct = require('./sale-product.model');
const User = require('./user.model');
const sequelize = require('../../loaders/databases/postgres-sequelize');
const PaymentMethod = require('./payment-method.model');

const saleStatusEnum = {
  '100': 'Draft',
  '300': 'Done',
  '400': 'Canceled',
};

const Sale = sequelize.define(
  'sale',
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
      enum: Object.keys(saleStatusEnum),
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

Sale.hasOne(User);
Sale.hasOne(PaymentMethod);

module.exports = Sale;
