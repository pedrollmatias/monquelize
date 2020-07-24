'use strict';

const categoryModel = require('../../models/category.model');

module.exports = function addCategory(data) {
  return categoryModel.add(data);
};
