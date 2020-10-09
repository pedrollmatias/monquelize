'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../../loaders/databases/postgres-sequelize');

const PurchaseProduct = sequelize.define(
  'purchaseProduct',
  {
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'purchases_products',
  }
);

module.exports = PurchaseProduct;
