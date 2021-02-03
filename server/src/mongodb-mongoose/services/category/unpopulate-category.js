'use strict';

module.exports = function unpopulateCategory(category) {
  category.parent = category.parent ? category.parent._id || category.parent : undefined;

  return category;
};
