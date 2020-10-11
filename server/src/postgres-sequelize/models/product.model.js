'use strict';

const Category = require('./category.model');
const Unit = require('./unit.model');
const History = require('./history.model');
const PurchaseProduct = require('./purchase-product.model');
const SaleProduct = require('./sale-product.model');
const Purchase = require('./purchase.model');
const Sale = require('./sale.model');

const { DataTypes } = require('sequelize');
const sequelize = require('../../loaders/databases/postgres-sequelize');

const Product = sequelize.define(
  'product',
  {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sku: {
      type: DataTypes.STRING,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    salePrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    costPrice: {
      type: DataTypes.FLOAT,
    },
    currentAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    minAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    maxAmount: {
      type: DataTypes.FLOAT,
    },
    removed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['sku'],
      },
    ],
  }
);

Product.belongsTo(Category);
Product.belongsTo(Unit);
Product.hasMany(History);
Product.belongsToMany(Purchase, { through: PurchaseProduct });
Purchase.belongsToMany(Product, { through: PurchaseProduct });
Product.belongsToMany(Sale, { through: SaleProduct });
Sale.belongsToMany(Product, { through: SaleProduct });

Product.beforeValidate(async (product) => {
  if (product.currentAmount < 0) {
    throw new Error('Quantity in inventory unavaliable');
  } else if (product.minAmount && product.currentAmount < product.minAmount) {
    throw new Error('A product can not have an amount less than the minimum allowed');
  }

  if (product.maxAmount && product.currentAmount > product.maxAmount) {
    throw new Error('A product can not have an amount greater than the maximum allowed');
  }

  if (product.minAmount && product.maxAmount && product.minAmount > product.maxAmount) {
    throw new Error('Minimum amount can not be greater than maximum amount');
  }
});

module.exports = Product;
