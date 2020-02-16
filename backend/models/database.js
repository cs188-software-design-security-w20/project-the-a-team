'use strict';

const Sequelize = require('sequelize');
const config = require('../config.json');

const sequelize = new Sequelize('taxmax', 'taximus', config.credentials.databasePassword, {
  host: 'db_postgres',
  dialect: 'postgres',
  isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
});

exports.sequelize = sequelize;
