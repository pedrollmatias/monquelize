'use strict';

const { Category } = require('../../models');

module.exports = async function getCategories() {
  return Category.findAll();
};
