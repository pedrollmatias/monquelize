'use strict';

const mongoose = require('mongoose');

module.exports = async (databaseURL) => {
  const connection = await mongoose.connect(databaseURL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

  return connection.connection.db;
};
