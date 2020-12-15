'use strict';

const { categoryModel } = require('../../models');

module.exports = function addCategory(category) {
  return categoryModel.add(category);
};
