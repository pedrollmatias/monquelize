'use strict';

const { categoryModel } = require('../../models');

module.exports = function getChildrenCategories(categoryId) {
  return categoryModel.find({ parent: categoryId });
};
