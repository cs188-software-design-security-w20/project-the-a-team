'use strict';

const { sequelize } = require('./database.js');
require('./User.js');
require('./Taxinfo.js');
require('./Fw2.js');
require('./F1099int.js');
require('./F1099b.js');
require('./F1099div.js');
require('./Dependents');

// sync all tables
sequelize.sync().then(() => {
  console.log('Database synchronized'); // eslint-disable-line no-console
}).catch((err) => {
  process.nextTick(() => {
    console.error('Failed to sync database'); // eslint-disable-line no-console
    throw err;
  });
});
