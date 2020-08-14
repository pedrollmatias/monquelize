'use strict';

const mongoose = require('mongoose');
const { servers } = require('../../config');

module.exports = (async function () {
  const connection = await mongoose.connect(servers['mongodb-mongoose'].databaseURL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

  return connection.connection.db;
})();
