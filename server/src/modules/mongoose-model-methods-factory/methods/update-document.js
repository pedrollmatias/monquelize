'use strict';

module.exports = function update(document, data) {
  document.set(data);

  return document.save();
};
