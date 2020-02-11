'use strict';

const query = require('./query.js');

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

function calculate(user) {
  const forms = query.getUserData(user);
  if (forms === null) {
    console.log('there are no forms for this user'); // eslint-disable-line
    return null;
  }
  const [dep1, dep2, dep3, dep4] = forms.dependents;
  const isSingle = !(forms.taxinfo.spouseName && forms.taxinfo.spouseSsn);
  const line1 = calcTotalWages(forms.fw2);
  const line2a = calcTotalTaxExemptInterest(forms.f1099int, forms.f1099div);
  const line2b = calcTotalTaxableInterest(forms.f1099int);
  const line3a = calcTotalQualDiv(forms.f1099div);
  const line3b = calcTotalOrdDiv(forms.f1099div);
  const line7b = line1 + line2b + line3b;
  return {
    firstName: forms.taxinfo.firstName + forms.taxinfo.middleName[0],
    lastName: forms.taxinfo.lastName,
    spouseName: forms.taxinfo.spouseName,
    spouseSsn: forms.taxinfo.spouseSsn,
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
  };
}

module.exports = { calculate };
