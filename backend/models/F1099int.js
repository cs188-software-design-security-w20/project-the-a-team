'use strict';

const Sequelize = require('sequelize');
const { sequelize } = require('./database.js');
const Taxinfo = require('./Taxinfo.js');

class F1099int extends Sequelize.Model {}

F1099int.init({
  uuid: { type: Sequelize.DataTypes.UUID, unique: true },
  payer: Sequelize.DataTypes.STRING,
  income: Sequelize.DataTypes.BIGINT,
  us_saving_treas_interest: Sequelize.DataTypes.BIGINT,
  tax_withheld: Sequelize.DataTypes.BIGINT,
  tax_exempt_interest: Sequelize.DataTypes.BIGINT,
}, {
  sequelize,
  modelName: 'f1099int',
  indexes: [{ unique: true, fields: 'uuid' }],
});

F1099int.belongsTo(Taxinfo);

F1099int.sync().catch((err) => {
  process.nextTick(() => {
    console.error('Failed to sync Taxinfo db'); // eslint-disable-line no-console
    throw err;
  });
});

module.exports = F1099int;
