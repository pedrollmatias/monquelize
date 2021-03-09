'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../loaders/databases/postgres-sequelize');

const Category = sequelize.define(
  'category',
  {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isValidName: function (name) {
          if (/>/.test(name)) {
            throw new Error('The category name can not have the character ">"');
          }
        },
      },
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    parent: {
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
        fields: ['name', 'parent'],
      },
    ],
  }
);

function getPathRegex(name) {
  return new RegExp(`(^|( > ))${name} > `);
}

function isParent(category1, category2) {
  return getPathRegex(category1.name).test(category2.path);
}

function setPath(category, parent) {
  category.path = parent ? `${parent.path} > ${category.name}` : category.name;

  return category;
}

async function validateCategory(category) {
  if (/>/.test(category.name)) {
    throw new Error('The category name can not have the character ">"');
  }

  if (category.parent) {
    const parent = await Category.findByPk(category.parent.associatedIds.postgresSequelizeId);

    category.parent = category.parent.associatedIds.postgresSequelizeId;

    if (!parent) {
      throw new Error('Parent category not found');
    }

    if (parent._id === category._id) {
      throw new Error('A category can not be its own subcategory');
    }

    if (isParent(category, parent)) {
      throw new Error('It is not possible to define as a parent category one of its child categories');
    }

    category = setPath(category, parent);
  } else {
    category = setPath(category);
  }
}

Category.beforeValidate(validateCategory);
Category.afterValidate(function (instance, options) {
  options.fields = instance.changed();
});
Category.beforeUpdate(validateCategory);

module.exports = Category;
