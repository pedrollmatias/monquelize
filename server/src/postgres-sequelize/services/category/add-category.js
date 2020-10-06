'use strict';

const { Category } = require('../../models');
const validateCategory = require('./validate-category');

module.exports = async function addCategory(category) {
  await validateCategory(category);

  return Category.create(category);
};
