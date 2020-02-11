'use strict';

const Sequelize = require('sequelize');
const { sequelize } = require('./database.js');

class User extends Sequelize.Model {}

User.init({
  uuid: { type: Sequelize.DataTypes.UUID, unique: true, allowNull: false },
  googleId: { type: Sequelize.DataTypes.STRING, unique: true, allowNull: false },
  pdfResult: Sequelize.DataTypes.STRING,
}, {
  sequelize,
  modelName: 'user',
  indexes: [
    { unique: true, fields: ['uuid'] },
    { unique: true, fields: ['googleId'] },
  ],
});

module.exports = User;
