'use strict';

const { User } = require('../../models');

module.exports = async function getUser(userId) {
  return User.findOne({ where: { _id: userId } });
};
