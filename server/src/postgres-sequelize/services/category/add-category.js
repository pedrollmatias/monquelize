'use strict';

const { Category } = require('../../models');

module.exports = function addCategory(category) {
  return Category.create(category);
};
