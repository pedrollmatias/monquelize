'use strict';

const { Category } = require('../../models');

module.exports = async function getCategory(categoryId) {
  return Category.findOne({ where: { _id: categoryId } });
};
