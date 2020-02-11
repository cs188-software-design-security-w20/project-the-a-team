'use strict';

const Sequelize = require('sequelize');
const { sequelize } = require('./database.js');
const Taxinfo = require('./Taxinfo.js');

class F1099b extends Sequelize.Model {}

F1099b.init({
  uuid: { type: Sequelize.DataTypes.UUID, unique: true, allowNull: false },
  desc: Sequelize.DataTypes.STRING,
  proceeds: Sequelize.DataTypes.BIGINT,
  basis: Sequelize.DataTypes.BIGINT,
  isLongTerm: Sequelize.DataTypes.BOOLEAN,
  taxWithheld: Sequelize.DataTypes.BIGINT,
}, {
  sequelize,
  modelName: 'f1099b',
  indexes: [{ unique: true, fields: ['taxinfoId', 'uuid'] }],
});

F1099b.belongsTo(Taxinfo);

module.exports = F1099b;
