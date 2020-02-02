'use strict';

const Sequelize = require('sequelize');
const { sequelize } = require('./database.js');
const Taxinfo = require('./Taxinfo.js');

class Fw2 extends Sequelize.Model {}

Fw2.init({
  uuid: { type: Sequelize.DataTypes.UUID, unique: true },
  employer: Sequelize.DataTypes.STRING,
  income: Sequelize.DataTypes.BIGINT,
  tax_withheld: Sequelize.DataTypes.BIGINT,
}, {
  sequelize,
  modelName: 'fw2',
  indexes: [{ unique: true, fields: 'uuid' }],
});

Fw2.belongsTo(Taxinfo);

Fw2.sync().catch((err) => {
  process.nextTick(() => {
    console.error('Failed to sync Taxinfo db'); // eslint-disable-line no-console
    throw err;
  });
});

module.exports = Fw2;
