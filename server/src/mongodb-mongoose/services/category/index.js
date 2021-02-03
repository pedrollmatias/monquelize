'use strict';

module.exports = {
  add: require('./add-category'),
  edit: require('./edit-category'),
  get: require('./get-categories'),
  remove: require('./remove-category'),
  retrieve: require('./get-category'),
  addProduct: require('./add-product-category'),
  editProduct: require('./edit-product-category'),
  removeProduct: require('./remove-product-category'),
  getChildren: require('./get-childen-categories'),
  editChildrenPaths: require('./edit-children-categories-paths'),
  unpopulate: require('./unpopulate-category'),
};
