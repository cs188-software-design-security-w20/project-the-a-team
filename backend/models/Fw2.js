'use strict';

const Sequelize = require('sequelize');
const { sequelize } = require('./database.js');
const Taxinfo = require('./Taxinfo.js');

class Fw2 extends Sequelize.Model {}

Fw2.init({
  uuid: { type: Sequelize.DataTypes.UUID, unique: true, allowNull: false },
  employer: Sequelize.DataTypes.STRING,
  income: Sequelize.DataTypes.BIGINT,
  taxWithheld: Sequelize.DataTypes.BIGINT,
}, {
  sequelize,
  modelName: 'fw2',
  indexes: [{ unique: true, fields: ['taxinfoId', 'uuid'] }],
});

Fw2.belongsTo(Taxinfo);

module.exports = Fw2;
