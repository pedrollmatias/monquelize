'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../../loaders/databases/postgres-sequelize');

const Category = sequelize.define(
  'Category',
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
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    parent: {
      type: DataTypes.INTEGER,
    },
  },
  {
    modelName: 'Categories',
    indexes: [
      {
        unique: true,
        fields: ['name', 'parent'],
      },
    ],
  }
);

module.exports = Category;
