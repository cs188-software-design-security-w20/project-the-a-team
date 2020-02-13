'use strict';

const { promisify } = require('util');
const pdfFiller = require('pdffiller');

const fillFormWithFlatten = promisify(pdfFiller.fillFormWithFlatten).bind(pdfFiller);

/* eslint-disable global-require */
const fieldsMap = {
  1040: require('./f1040-fields.json'),
};
/* eslint-enable global-require */

const srcFileNameMap = {
  1040: 'f1040.pdf',
};

async function fillForm(form, data, destFileName) {
  const srcFileName = srcFileNameMap[form];
  const fields = fieldsMap[form];

  const betterData = {};
  for (const key of Object.keys(data)) {
    const field = fields[key];
    if (!field) {
      console.error(`Field not found: ${key}`);
    } else if (field.type === 'Checkbox') {
      if (data[key]) {
        betterData[field.pdfName] = field.checked;
      }
    } else if (field.type === 'Text') {
      betterData[field.pdfName] = data[key];
    } else {
      console.warn(`Unknown field type: ${field.type}`);
    }
  }

  await fillFormWithFlatten(srcFileName, destFileName, betterData, /* flatten = */ false);
}
exports.fillForm = fillForm;

// Sample usage:
// fillForm('1040', {
//   isSingle: false,
//   isMarriedFilingSeparately: true,
//   spouseName: 'spouseName',
//   firstName: 'firstName',
//   lastName: 'lastName',
//   ssn: '12356789',
//   spouseSSN: 'spouseSSN',
//   addr1: 'addr1',
//   addr2: 'addr2',
//   addr3: 'addr3',
//   dep1Name: 'dep1Name',
//   dep1SSN: 'dep1SSN',
//   dep1Rel: 'dep1Rel',
//   dep1ChildCredit: false,
//   dep2Name: 'dep2Name',
//   dep2SSN: 'dep2SSN',
//   dep2Rel: 'dep2Rel',
//   dep2ChildCredit: true,
//   dep3Name: 'dep3Name',
//   dep3SSN: 'dep3SSN',
//   dep3Rel: 'dep3Rel',
//   dep3ChildCredit: false,
//   dep4Name: 'dep4Name',
//   dep4SSN: 'dep4SSN',
//   dep4Rel: 'dep4Rel',
//   dep4ChildCredit: true,
//   l1: 'l1',
//   l2a: 'l2a',
//   l2b: 'l2b',
//   l3a: 'l3a',
//   l3b: 'l3b',
//   l4a: 'l4a',
//   l4b: 'l4b',
//   l4c: 'l4c',
//   l4d: 'l4d',
//   l5a: 'l5a',
//   l5b: 'l5b',
//   l6box: true,
//   l6: 'l6',
//   l7a: 'l7a',
//   l7b: 'l7b',
//   l8a: 'l8a',
//   l8b: 'l8b',
//   l9: 'l9',
//   l10: 'l10',
//   l11a: 'l11a',
//   l11b: 'l11b',
//   l12abox1: true,
//   l12abox2: true,
//   l12abox3: true,
//   l12a3: 'l12a3',
//   l12a: 'l12a',
//   l12b: 'l12b',
//   l13a: 'l13a',
//   l13b: 'l13b',
//   l15: 'l15',
//   l16: 'l16',
//   l17: 'l17',
//   l18a: 'l18a',
//   l18b: 'l18b',
//   l18c: 'l18c',
//   l18d: 'l18d',
//   l18e: 'l18e',
//   l19: 'l19',
//   l20: 'l20',
//   l21abox: true,
//   l21a: 'l21a',
//   isChecking: true,
//   isSavings: true,
//   accountno: 'accountno',
//   l22: 'l22',
//   l23: 'l23',
//   l24: 'l24'
// }, 'dest.pdf');
