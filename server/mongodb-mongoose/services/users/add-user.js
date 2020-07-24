'use strict';

const userModel = require('../../models/user.model');

module.exports = function addUser(data) {
  return userModel.add(data);
};
