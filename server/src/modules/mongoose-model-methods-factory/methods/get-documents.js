'use strict';

module.exports = function get(model, query, session) {
  return model.find(query, { session: session });
};
