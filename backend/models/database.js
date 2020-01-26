'use strict';

const Sequelize = require('sequelize');
const sequelize = new Sequelize('taxmax', 'taximus', '', {
  host: 'db_postgres',
  dialect: 'postgres'
});

exports.sequelize = sequelize;
