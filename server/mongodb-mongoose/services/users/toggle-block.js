'use strict';

const userModel = require('../../models/user.model');

module.exports = async function toggleBlock(userId) {
  const user = await userModel.load(userId);

  return user.edit({ blocked: !user.blocked });
};
