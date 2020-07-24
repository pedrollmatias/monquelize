'use strict';

const categoryModel = require('../../models/category.model');

module.exports = function getCategory(categoryId) {
  return categoryModel.categoryModel(categoryId);
};
