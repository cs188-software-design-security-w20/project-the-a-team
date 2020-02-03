'use strict';

const Sequelize = require('sequelize');
const { sequelize } = require('./database.js');

class User extends Sequelize.Model {}

User.init({
  uuid: { type: Sequelize.DataTypes.UUID, unique: true },
  googleId: { type: Sequelize.DataTypes.STRING, unique: true },
  pdfResult: Sequelize.DataTypes.STRING,
}, {
  sequelize,
  modelName: 'user',
  indexes: [
    { unique: true, fields: ['uuid'] },
    { unique: true, fields: ['googleId'] },
  ],
});

User.sync().catch((err) => {
  process.nextTick(() => {
    console.error('Failed to sync User table'); // eslint-disable-line no-console
    throw err;
  });
});

module.exports = User;
