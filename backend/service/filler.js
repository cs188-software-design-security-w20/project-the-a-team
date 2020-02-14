'use strict';

const path = require('path');
const pdfFiller = require('../contrib/pdffiller.js');

/* eslint-disable global-require */
const fieldsMap = {
  1040: require('./f1040-fields.json'),
};
/* eslint-enable global-require */

const srcFileNameMap = {
  1040: path.join(__dirname, 'f1040.pdf'),
};

async function fillForm(form, data, destFileName) {
  const srcFileName = srcFileNameMap[form];
  const fields = fieldsMap[form];

  const betterData = {};
  for (const key of Object.keys(data)) {
    const field = fields[key];
    if (!field) {
      console.error(`Field not found: ${key}`); // eslint-disable-line
    } else if (field.type === 'Checkbox') {
      if (data[key]) {
        betterData[field.pdfName] = field.checked;
      }
    } else if (field.type === 'Text') {
      if (typeof data[key] === 'string') {
        betterData[field.pdfName] = data[key];
      }
    } else {
      console.warn(`Unknown field type: ${field.type}`); // eslint-disable-line
    }
  }

  await pdfFiller(srcFileName, destFileName, betterData);
}
exports.fillForm = fillForm;
