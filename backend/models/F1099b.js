'use strict';

const Sequelize = require('sequelize');
const { sequelize } = require('./database.js');
const Taxinfo = require('./Taxinfo.js');

class F1099b extends Sequelize.Model {}

F1099b.init({
  uuid: { type: Sequelize.DataTypes.UUID, unique: true },
  desc: Sequelize.DataTypes.STRING,
  proceeds: Sequelize.DataTypes.BIGINT,
  basis: Sequelize.DataTypes.BIGINT,
  is_long_term: Sequelize.DataTypes.BOOLEAN,
  tax_withheld: Sequelize.DataTypes.BIGINT,
}, {
  sequelize,
  modelName: 'f1099b',
  indexes: [{ unique: true, fields: 'uuid' }],
});

F1099b.belongsTo(Taxinfo);

F1099b.sync().catch((err) => {
  process.nextTick(() => {
    console.error('Failed to sync F1099b table'); // eslint-disable-line no-console
    throw err;
  });
});

module.exports = F1099b;
