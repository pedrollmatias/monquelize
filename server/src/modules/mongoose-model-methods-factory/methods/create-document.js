'use strict';

module.exports = function create(model, data, session) {
  const document = new model(data);

  return document.save({ session });
};
