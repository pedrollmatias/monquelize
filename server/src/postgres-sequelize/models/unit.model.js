'use strict';

const { DataTypes } = require('sequelize');
const Product = require('./product.model');
const sequelize = require('../../loaders/databases/postgres-sequelize');

const Unit = sequelize.define(
  'unit',
  {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortUnit: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    decimalPlaces: {
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
        fields: ['unit'],
      },
    ],
  }
);

Unit.beforeDestroy(async (unit) => {
  const relatedProducts = await Product.findAll({ where: { unit: unit._id } });

  if (relatedProducts.length) {
    throw new Error('Can not remove units which has related products. Remove the unit from related products first.');
  }
});

module.exports = Unit;
