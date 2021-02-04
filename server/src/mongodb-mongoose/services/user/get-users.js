'use strict';

const { userModel } = require('../../models');

module.exports = function getUsers(query) {
  query = query || {};

  return userModel.find(query);
};
