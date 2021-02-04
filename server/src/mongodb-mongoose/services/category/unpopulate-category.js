'use strict';

module.exports = function unpopulateCategory(categoryData) {
  categoryData.parent = categoryData.parent ? categoryData.parent._id || categoryData.parent : undefined;

  return categoryData;
};
