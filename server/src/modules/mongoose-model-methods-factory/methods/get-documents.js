'use strict';

module.exports = function get(model, query, session) {
  return session ? model.find(query).session(session) : model.find(query);
};
