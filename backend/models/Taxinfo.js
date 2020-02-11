'use strict';

const Sequelize = require('sequelize');
const { sequelize } = require('./database.js');
const User = require('./User.js');

class Taxinfo extends Sequelize.Model {}

Taxinfo.init({
  lastName: Sequelize.DataTypes.STRING,
  firstName: Sequelize.DataTypes.STRING,
  middleName: Sequelize.DataTypes.STRING,
  ssn: Sequelize.DataTypes.STRING,
  spouseName: Sequelize.DataTypes.STRING,
  spouseSSN: Sequelize.DataTypes.STRING,
  addr1: Sequelize.DataTypes.STRING,
  addr2: Sequelize.DataTypes.STRING,
  addr3: Sequelize.DataTypes.STRING,
  bankAccount: Sequelize.DataTypes.STRING,
  bankRouting: Sequelize.DataTypes.STRING,
  bankIsChecking: Sequelize.DataTypes.BOOLEAN,
}, {
  sequelize,
  modelName: 'taxinfo',
  indexes: [{ unique: true, fields: ['userId'] }],
});

Taxinfo.belongsTo(User);

module.exports = Taxinfo;
