'use strict';

const Sequelize = require('sequelize');
const { sequelize } = require('./database.js');
const Taxinfo = require('./Taxinfo.js');

class F1099int extends Sequelize.Model {}

F1099int.init({
  uuid: { type: Sequelize.DataTypes.UUID, unique: true, allowNull: false },
  payer: Sequelize.DataTypes.STRING,
  income: Sequelize.DataTypes.BIGINT,
  usSavingTreasInterest: Sequelize.DataTypes.BIGINT,
  taxWithheld: Sequelize.DataTypes.BIGINT,
  taxExemptInterest: Sequelize.DataTypes.BIGINT,
}, {
  sequelize,
  modelName: 'f1099int',
  indexes: [{ unique: true, fields: ['taxinfoId', 'uuid'] }],
});

F1099int.belongsTo(Taxinfo);

module.exports = F1099int;
