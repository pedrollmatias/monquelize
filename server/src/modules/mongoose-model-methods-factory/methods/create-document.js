'use strict';

module.exports = function create(model, data) {
  const document = new model(data);

  return document.save();
};
