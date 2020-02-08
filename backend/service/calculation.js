'use strict';

const query = require('./query.js');

const calcTotalWages = (fw2) => {
  let total = 0;
  for (const form of fw2) {
    if (form.income) {
      total += (BigInt(form.income));
    }
  }
  return (total / 100);
};

const calcTotalTaxExemptInterest = (f1099int, f1099div) => {
  let total = 0;
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
  return (total / 100);
};

const calcTotalTaxableInterest = (f1099int) => {
  let total = 0;
  for (const form of f1099int) {
    if (form.income) {
      total += (BigInt(form.income));
    }
  }
  return (total / 100);
};

const calculate = (user) => {
  const forms = query.getUserData(user);
  if (forms === null) {
    console.log('there are no forms for this user'); // eslint-disable-line
    return null;
  }
  const [
    dep1,
    dep2,
    dep3,
    dep4,
  ] = forms.dependents;
  const isSingle = !(forms.taxinfo.spouseName && forms.taxinfo.spouseSsn);
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
    l1: calcTotalWages(forms.fw2),
    l2a: calcTotalTaxExemptInterest(forms.f1099int, forms.f1099div),
    l2b: calcTotalTaxableInterest(forms.f1099int),
  };
};

module.exports = { calculate };
