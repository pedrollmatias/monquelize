'use strict';

module.exports = {
  add: require('./add-category'),
  addProduct: require('./add-product-category'),
  edit: require('./edit-category'),
  editProduct: require('./edit-product-category'),
  editChildrenPaths: require('./edit-children-categories-paths'),
  get: require('./get-categories'),
  getChildren: require('./get-childen-categories'),
  remove: require('./remove-category'),
  removeProduct: require('./remove-product-category'),
  retrieve: require('./get-category'),
  unpopulate: require('./unpopulate-category'),
};
