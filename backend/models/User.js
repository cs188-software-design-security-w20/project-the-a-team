'use strict';

const Sequelize = require('sequelize');
const { sequelize } = require('./database.js');

class User extends Sequelize.Model {}

User.init({
  uuid: { type: Sequelize.DataTypes.UUID, unique: true },
  google_id: { type: Sequelize.DataTypes.STRING, unique: true },
  pdf_result: Sequelize.DataTypes.STRING,
}, {
  sequelize,
  modelName: 'user',
  indexes: [
    { unique: true, fields: ['uuid'] },
    { unique: true, fields: ['google_id'] },
  ],
});

User.sync().catch((err) => {
  process.nextTick(() => {
    console.error('Failed to sync User db'); // eslint-disable-line no-console
    throw err;
  });
});

module.exports = User;
