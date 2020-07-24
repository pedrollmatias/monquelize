'use strict';

const { categoryModel } = require('../../models');

module.exports = function getCategories(query) {
  return query.getProducts
    ? categoryModel.find().sort({ path: 1 })
    : categoryModel.find().select({ name: 1, parent: 1, path: 1, _id: 1 }).sort({ path: 1 });
};
