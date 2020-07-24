'use strict';

module.exports = {
  query: require('./get-user'),
  get: require('./get-users'),
  add: require('./add-user'),
  edit: require('./edit-user'),
  toggleBlock: require('./toggle-block'),
};
