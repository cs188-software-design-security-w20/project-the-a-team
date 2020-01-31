'use strict';

const Sequelize = require('sequelize');
const { sequelize } = require('./database.js');

class Taxinfo extends Sequelize.Model {}

Taxinfo.init({
  ssn: Sequelize.DataTypes.STRING,
}, { sequelize, modelName: 'taxinfo' });

Taxinfo.sync().catch((err) => {
  process.nextTick(() => {
    console.error('Failed to sync Taxinfo db'); // eslint-disable-line no-console
    throw err;
  });
});

module.exports = Taxinfo;
