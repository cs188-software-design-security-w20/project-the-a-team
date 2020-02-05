'use strict';

const Sequelize = require('sequelize');
const { sequelize } = require('./database.js');
const Taxinfo = require('./Taxinfo.js');

class F1099div extends Sequelize.Model {}

F1099div.init({
  uuid: { type: Sequelize.DataTypes.UUID, unique: true, allowNull: false },
  payer: Sequelize.DataTypes.STRING,
  ordDividends: Sequelize.DataTypes.BIGINT,
  qualDividends: Sequelize.DataTypes.BIGINT,
  taxWithheld: Sequelize.DataTypes.BIGINT,
}, {
  sequelize,
  modelName: 'f1099div',
  indexes: [{ unique: true, fields: ['taxinfoId', 'uuid'] }],
});

F1099div.belongsTo(Taxinfo);

module.exports = F1099div;
