'use strict';

module.exports = process.env.NODE_ENV === 'production' ?
  require('./config-production.json') :
  require('./config.json');
