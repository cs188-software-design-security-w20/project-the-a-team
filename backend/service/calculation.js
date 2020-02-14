'use strict';

const fs = require('fs').promises;
const os = require('os');
const path = require('path');
const rimrafAsync = require('rimraf');
const { promisify } = require('util');

const { fillForm } = require('./filler.js');
const query = require('./query.js');
const { storeFile } = require('./storage.js');
const taxtable = require('../taxtable.json');

const rimraf = promisify(rimrafAsync);

function roundDown(n, r) {
  return n / r * r; // eslint-disable-line
}

function roundDiv(n, d) {
  return (n + d / 2n) / d;
}

function calcTotalWages(fw2) {
  let total = 0n;
  for (const form of fw2) {
    if (form.income) {
      total += (BigInt(form.income));
    }
  }
  return total;
}

function calcTotalTaxExemptInterest(f1099int, f1099div) {
  let total = 0n;
  for (const form of f1099int) {
    if (form.taxExemptInterest) {
      total += (BigInt(form.taxExemptInterest));
    }
  }
  for (const form of f1099div) {
    if (form.exemptInterestDiv) {
      total += (BigInt(form.exemptInterestDiv));
    }
  }
  return total;
}

function calcTotalTaxableInterest(f1099int) {
  let total = 0n;
  for (const form of f1099int) {
    if (form.income) {
      total += (BigInt(form.income));
    }
  }
  return total;
}

function calcTotalQualDiv(f1099div) {
  let total = 0n;
  for (const form of f1099div) {
    if (form.qualDividends) {
      total += (BigInt(form.qualDividends));
    }
  }
  return total;
}

function calcTotalOrdDiv(f1099div) {
  let total = 0n;
  for (const form of f1099div) {
    if (form.ordDividends) {
      total += (BigInt(form.ordDividends));
    }
  }
  return total;
}

function calcTax(line11b, isSingle) {
  let tax = 0n;
  if (line11b < 300000n) {
    const dollars = line11b / 100n;
    const rounded = String(roundDown(dollars, 25n));
    tax = BigInt(taxtable[rounded]) * 100n;
  } else if (line11b < 10000000n) {
    const dollars = line11b / 100n;
    const rounded = String(roundDown(dollars, 50n));
    tax = BigInt(taxtable[rounded]) * 100n;
  } else if (line11b < 16072500n) {
    tax = roundDiv(line11b * 24n, 100n) - 582550n;
  } else if (line11b < 20410000n) {
    tax = roundDiv(line11b * 32n, 100n) - 1868350n;
  } else if (line11b < 30617500n && !isSingle) {
    tax = roundDiv(line11b * 35n, 100n) - 2480600n;
  } else if (!isSingle) {
    tax = roundDiv(line11b * 37n, 100n) - 3093000n;
  } else if (line11b < 51030000n && isSingle) {
    tax = roundDiv(line11b * 35n, 100n) - 2408600n;
  } else if (isSingle) {
    tax = roundDiv(line11b * 37n, 100n) - 3093000n;
  }
  return tax;
}

function calcTotalDependentCredit(taxinfo, dependents, line8b, line12b) {
  let line1 = 0n;
  let line2 = 0n;
  for (const dependent in dependents) {
    if (dependent.childCredit) {
      line1 += 2000n;
    } else {
      line2 += 500n;
    }
  }
  const line3 = line1 + line2;
  let line7 = 0n;
  if (line8b < 200000n) {
    line7 = 200000n - line8b;
  }
  line7 /= 20n;
  if (line3 > line7) {
    return 0n;
  }
  const line8 = line7 - line3;
  const line11 = line12b;
  if (line8 > line11) {
    return line11;
  }
  return line8;
}

function calcTotalTaxWithheld(forms) {
  let total = 0n;
  for (const formType of forms) {
    for (const form of formType) {
      if (form.taxWithheld) {
        total += (BigInt(form.taxWithheld));
      }
    }
  }
  return total;
}

function bigIntToString(bigInt, roundUpToZero) {
  let num = bigInt;
  const isNeg = num < 0n;
  if (num === 0n || (isNeg && roundUpToZero)) {
    return '-0-';
  }

  if (isNeg) num = -num;
  const dollarPart = String(num / 100n);
  const centPart = String(num % 100n).padStart(2, '0');

  if (isNeg) {
    return `(${dollarPart}.${centPart})`;
  }
  return `${dollarPart}.${centPart}`;
}

function calculate(forms) {
  const [dep1, dep2, dep3, dep4] = forms.dependents;
  const isSingle = !(forms.taxinfo.spouseName && forms.taxinfo.spouseSsn);
  const line1 = calcTotalWages(forms.fw2);
  const line2a = calcTotalTaxExemptInterest(forms.f1099int, forms.f1099div);
  const line2b = calcTotalTaxableInterest(forms.f1099int);
  const line3a = calcTotalQualDiv(forms.f1099div);
  const line3b = calcTotalOrdDiv(forms.f1099div);
  const line7b = line1 + line2b + line3b;
  const line8b = line7b;
  const line9 = 1220000n;
  const line11a = line9;
  const line11b = line8b < line11a ? 0n : line8b - line11a;
  const line12a = calcTax(line11b, isSingle);
  const line13a = calcTotalDependentCredit(forms.taxinfo, forms.dependents, line7b, line12a);
  const line14 = line12a - line13a;
  const line17 = calcTotalTaxWithheld([forms.fw2, forms.f1099int, forms.f1099div, forms.f1099b]);
  const line20 = line17 > line14 ? line17 - line14 : 0n;
  return {
    firstName: forms.taxinfo.firstName + (forms.taxinfo.middleName ? ` ${forms.taxinfo.middleName[0]}` : ''),
    lastName: forms.taxinfo.lastName,
    ssn: forms.taxinfo.ssn,
    spouseName: forms.taxinfo.spouseName,
    spouseSSN: forms.taxinfo.spouseSsn,
    addr1: forms.taxinfo.addr1,
    addr2: forms.taxinfo.addr2,
    addr3: forms.taxinfo.addr3,
    isSingle,
    isMarriedFilingSeparately: !isSingle,
    dep1Name: dep1 ? dep1.name : '',
    dep1SSN: dep1 ? dep1.ssn : '',
    dep1Rel: dep1 ? dep1.relation : '',
    dep1ChildCredit: dep1 ? dep1.childCredit : false,
    dep2Name: dep2 ? dep2.name : '',
    dep2SSN: dep2 ? dep2.ssn : '',
    dep2Rel: dep2 ? dep2.relation : '',
    dep2ChildCredit: dep2 ? dep2.childCredit : false,
    dep3Name: dep3 ? dep3.name : '',
    dep3SSN: dep3 ? dep3.ssn : '',
    dep3Rel: dep3 ? dep3.relation : '',
    dep3ChildCredit: dep3 ? dep3.childCredit : false,
    dep4Name: dep4 ? dep4.name : '',
    dep4SSN: dep4 ? dep4.ssn : '',
    dep4Rel: dep4 ? dep4.relation : '',
    dep4ChildCredit: dep4 ? dep4.childCredit : false,
    l1: bigIntToString(line1),
    l2a: bigIntToString(line2a),
    l2b: bigIntToString(line2b),
    l3a: bigIntToString(line3a),
    l3b: bigIntToString(line3b),
    l7b: bigIntToString(line7b),
    l8b: bigIntToString(line8b),
    l9: bigIntToString(line9),
    l11a: bigIntToString(line11a),
    l11b: bigIntToString(line11b),
    l12a: bigIntToString(line12a),
    l12b: bigIntToString(line12a),
    l13a: bigIntToString(line13a),
    l13b: bigIntToString(line13a),
    l14: bigIntToString(line14),
    l15: '-0-',
    l16: bigIntToString(line14),
    l17: bigIntToString(line17),
    l19: bigIntToString(line17),
    l20: bigIntToString(line20),
    routingno: forms.taxinfo.bankRouting,
    accountno: forms.taxinfo.bankAccount,
    isChecking: forms.taxinfo.bankIsChecking,
    isSavings: !forms.taxinfo.bankIsChecking,
  };
}

const TMP_DIR = os.tmpdir();

async function fillAndSave(user) {
  const forms = await query.getUserData(user);
  if (forms === null) {
    console.log('there are no forms for this user'); // eslint-disable-line
    return null;
  }

  const f1040 = calculate(forms);
  const dir = await fs.mkdtemp(TMP_DIR + path.sep);
  try {
    const filledForm = path.join(dir, 'f1040-filled.pdf');
    await fillForm('1040', f1040, filledForm);
    console.log(`Filled form in ${filledForm}`); // eslint-disable-line
    const storedFileName = await storeFile(filledForm);
    console.log(`Stored file in ${storedFileName}`); // eslint-disable-line

    await query.setUserPdfResult(storedFileName);
    return storedFileName;
  } finally {
    try {
      await rimraf(dir);
    } catch (e) {
      console.error(`Unable to delete temporary directory: ${dir}`); // eslint-disable-line
      // We give up.
    }
  }
}

module.exports = { calculate, fillAndSave };
