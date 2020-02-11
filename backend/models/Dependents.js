'use strict';

const Sequelize = require('sequelize');
const { sequelize } = require('./database.js');
const Taxinfo = require('./Taxinfo.js');

class Dependents extends Sequelize.Model {}

Dependents.init({
  uuid: { type: Sequelize.DataTypes.UUID, unique: true, allowNull: false },
  name: Sequelize.DataTypes.STRING,
  ssn: Sequelize.DataTypes.STRING,
  relation: Sequelize.DataTypes.STRING,
  childCredit: Sequelize.DataTypes.BOOLEAN,
}, {
  sequelize,
  modelName: 'dependents',
  indexes: [{ unique: true, fields: ['taxinfoId', 'uuid'] }],
});

Dependents.belongsTo(Taxinfo);

module.exports = Dependents;
