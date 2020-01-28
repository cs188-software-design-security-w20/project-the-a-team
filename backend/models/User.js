'use strict';

const Sequelize = require('sequelize');
const { sequelize } = require('./database.js');

class User extends Sequelize.Model {}

User.init({
  email: Sequelize.DataTypes.STRING,
}, { sequelize, modelName: 'user-test' }); // TODO: change model name

User.sync().catch((err) => {
  process.nextTick(() => {
    console.error('Failed to sync User db'); // eslint-disable-line no-console
    throw err;
  });
});

module.exports = User;
