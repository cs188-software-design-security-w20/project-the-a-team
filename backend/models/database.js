'use strict';

const Sequelize = require('sequelize');

const sequelize = new Sequelize('taxmax', 'taximus', '', { // TODO: assign password during production
  host: 'db_postgres',
  dialect: 'postgres',
  isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
});

exports.sequelize = sequelize;
