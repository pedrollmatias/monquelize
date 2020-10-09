'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../../loaders/databases/postgres-sequelize');

const SaleProduct = sequelize.define(
  'saleProduct',
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
    tableName: 'sales_products',
  }
);

module.exports = SaleProduct;
