'use strict';

module.exports = process.env.NODE_ENV === 'production'
  ? require('./config-production.json') // eslint-disable-line import/no-unresolved
  : require('./config.json');
