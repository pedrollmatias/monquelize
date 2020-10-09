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
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    costPrice: {
      type: DataTypes.INTEGER,
    },
    currentAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    minAmount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    maxAmount: {
      type: DataTypes.INTEGER,
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
Product.belongsToMany(Sale, { through: SaleProduct });

module.exports = Product;
