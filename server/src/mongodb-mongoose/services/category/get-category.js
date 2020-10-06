'use strict';

const { categoryModel } = require('../../models');

module.exports = function getCategory(categoryId) {
  return categoryModel.retrieve(categoryId);
};
