'use strict';
const Sequelize = require('sequelize');
const { sequelize } = require('./database.js');

class User extends Sequelize.Model {}

User.init({
  google_id: Sequelize.DataTypes.STRING,
  pdf_result: Sequelize.DataTypes.STRING,
  created_at: Sequelize.DataTypes.TIME,
  updated_at: Sequelize.DataTypes.TIME
}, { sequelize, modelName: 'user-test' }); // TODO: change model name

User.sync().catch(err => {
  process.nextTick(() => {
    console.error('Failed to sync User db'); // eslint-disable-line no-console
    throw err;
  });
});

module.exports = User;
