'use strict';

const userModel = require('../../models/user.model');

module.exports = function getUser(userId) {
  return userModel.retrieve(userId);
};
