'use strict';

const { userModel } = require('../../models');

module.exports = async function toggleBlock(userId) {
  const user = await userModel.retrieve(userId);

  return user.edit({ blocked: !user.blocked });
};
