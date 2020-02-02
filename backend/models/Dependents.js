'use strict';

const Sequelize = require('sequelize');
const { sequelize } = require('./database.js');
const Taxinfo = require('./Taxinfo.js');

class Dependents extends Sequelize.Model {}

Dependents.init({
  uuid: { type: Sequelize.DataTypes.UUID, unique: true },
  name: Sequelize.DataTypes.STRING,
  ssn: Sequelize.DataTypes.STRING,
  relation: Sequelize.DataTypes.STRING,
  child_credit: Sequelize.DataTypes.BOOLEAN,
}, {
  sequelize,
  modelName: 'dependents',
  indexes: [{ unique: true, fields: 'uuid' }],
});

Dependents.belongsTo(Taxinfo);

Dependents.sync().catch((err) => {
  process.nextTick(() => {
    console.error('Failed to sync Taxinfo db'); // eslint-disable-line no-console
    throw err;
  });
});

module.exports = Dependents;
