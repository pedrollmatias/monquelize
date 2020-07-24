'use strict';

const { userModel } = require('../../models');

module.exports = function getUser(userId) {
  return userModel.retrieve(userId);
};
