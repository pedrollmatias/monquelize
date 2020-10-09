'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../../loaders/databases/postgres-sequelize');

const User = sequelize.define(
  'user',
  {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      set: function () {
        this.setDataValue('fullName', `${this.firstName} ${this.lastName}`);
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sex: {
      type: DataTypes.STRING,
      enum: ['male', 'female'],
      allowNull: false,
    },
    bornDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    blocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['username'],
      },
    ],
  }
);

module.exports = User;
