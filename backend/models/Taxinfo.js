'use strict';

const Sequelize = require('sequelize');
const { sequelize } = require('./database.js');
const User = require('./User.js');

class Taxinfo extends Sequelize.Model {}

Taxinfo.init({
  ssn: Sequelize.DataTypes.STRING,
  address: Sequelize.DataTypes.STRING,
  bankAccount: Sequelize.DataTypes.STRING,
  bankRouting: Sequelize.DataTypes.STRING,
  bankIsChecking: Sequelize.DataTypes.BOOLEAN,
}, {
  sequelize,
  modelName: 'taxinfo',
  indexes: [{ unique: true, fields: ['userId'] }],
});

Taxinfo.belongsTo(User);

Taxinfo.sync().catch((err) => {
  process.nextTick(() => {
    console.error('Failed to sync Taxinfo table'); // eslint-disable-line no-console
    throw err;
  });
});

module.exports = Taxinfo;
