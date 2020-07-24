'use strict';

const userModel = require('../../models/user.model');

module.exports = function getUsers(query) {
  query = query || {};

  return userModel.find(query);
};
