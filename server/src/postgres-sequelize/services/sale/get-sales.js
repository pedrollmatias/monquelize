'use strict';

const { Sale } = require('../../models');
const { Op } = require('sequelize');
const dayjs = require('dayjs');

module.exports = function getSale(query) {
  const startDate = dayjs(new Date(query.startDate)).format('YYYY-MM-DD');
  const endDate = dayjs(new Date(query.endDate)).format('YYYY-MM-DD');
  const whereClause = { date: { [Op.between]: [startDate, endDate] } };

  return Sale.findAll({ where: whereClause });
};
