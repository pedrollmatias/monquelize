'use strict';

const { categoryModel } = require('../../models');

module.exports = function addCategory(data) {
  return categoryModel.add(data);
};
