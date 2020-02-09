'use strict';

const isBoolean = (obj) => typeof obj === 'boolean';
const isString = (obj) => typeof obj === 'string';
const isObject = (obj) => typeof obj === 'object' && !Array.isArray(obj) && obj !== null;
const isNumber = (obj) => typeof obj === 'number';
const isInMoneyLimit = (x) => x >= 0 && x <= Number.MAX_SAFE_INTEGER / 100;
const isInStringLimit = (s) => s.length <= 255;
const isDigitOnly = (s) => s.match(/^\d*$/);
const isValidSSN = (s) => s.match(/^\d{9}$/);
const isValidUUID = (s) => s.match(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i);

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
  }
}

const isValidationError = (obj) => obj instanceof ValidationError;

const validateBoolean = (obj, paramName) => {
  if ([undefined, null].includes(obj)) {
    return;
  }
  if (!isBoolean(obj)) {
    throw new ValidationError(`${paramName} should be boolean`);
  }
};

const validateString = (str, paramName) => {
  if ([undefined, null].includes(str)) {
    return;
  }
  if (!isString(str)) {
    throw new ValidationError(`${paramName} should be string`);
  }
  if (!isInStringLimit(str)) {
    throw new ValidationError(`${paramName} is too long`);
  }
};

const validateMoney = (money, paramName) => {
  if ([undefined, null].includes(money)) {
    return;
  }
  if (!isNumber(money)) {
    throw new ValidationError(`${paramName} should be a number`);
  }
  if (!isInMoneyLimit(money)) {
    throw new ValidationError(`${paramName} out of range`);
  }
};

const validateGoogleId = (googleId) => {
  if (!isString(googleId)) {
    throw new ValidationError('Google id should be string');
  }
  if (!isInStringLimit(googleId)) {
    throw new ValidationError('Google id is too long');
  }
};

const validateSSN = (ssn, paramName = 'SSN') => {
  if ([undefined, null, ''].includes(ssn)) {
    return;
  }
  if (!isString(ssn)) {
    throw new ValidationError(`${paramName} should be string`);
  }
  if (!isValidSSN(ssn)) {
    throw new ValidationError(`${paramName} should be 9 digits`);
  }
};

const validateBankAccount = (bankAccount, paramName = 'Bank account') => {
  if ([undefined, null].includes(bankAccount)) {
    return;
  }
  if (!isString(bankAccount)) {
    throw new ValidationError(`${paramName} should be string`);
  }
  if (!isDigitOnly(bankAccount)) {
    throw new ValidationError(`${paramName} should only contain digits`);
  }
  if (bankAccount.length > 17) {
    throw new ValidationError(`${paramName} is too long`);
  }
};

const validateBankRouting = (bankRouting, paramName = 'Bank routing') => {
  if ([undefined, null].includes(bankRouting)) {
    return;
  }
  if (!isString(bankRouting)) {
    throw new ValidationError(`${paramName} should be string`);
  }
  if (!isDigitOnly(bankRouting)) {
    throw new ValidationError(`${paramName} should only contain digits`);
  }
  if (bankRouting.length > 9) {
    throw new ValidationError(`${paramName} is too long`);
  }
};

const validateFw2Item = (fw2Item) => {
  if (fw2Item === null) {
    return;
  }
  if (!isObject(fw2Item)) {
    throw new ValidationError('Fw2 value should be an object or null');
  }
  validateString(fw2Item.employer, 'Fw2 employer');
  validateMoney(fw2Item.income, 'Fw2 income');
  validateMoney(fw2Item.taxWithheld, 'Fw2 tax withheld');
};

const validateF1099intItem = (f1099intItem) => {
  if (f1099intItem === null) {
    return;
  }
  if (!isObject(f1099intItem)) {
    throw new ValidationError('F1099int value should be an object or null');
  }
  validateString(f1099intItem.payer, 'F1099int payer');
  validateMoney(f1099intItem.income, 'F1099int income');
  validateMoney(f1099intItem.usSavingTreasInterest, 'F1099int Interest on U.S. Savings Bonds and Treas. obligations');
  validateMoney(f1099intItem.taxWithheld, 'F1099int tax withheld');
  validateMoney(f1099intItem.taxExemptInterest, 'F1099int tax-exempt interest');
};

const validateF1099bItem = (f1099bItem) => {
  if (f1099bItem === null) {
    return;
  }
  if (!isObject(f1099bItem)) {
    throw new ValidationError('F1099b value should be an object or null');
  }
  validateString(f1099bItem.desc, 'F1099b desc');
  validateMoney(f1099bItem.proceeds, 'F1099b proceeds');
  validateMoney(f1099bItem.basis, 'F1099b basis');
  validateBoolean(f1099bItem.isLongTerm, 'F1099b is long term');
  validateMoney(f1099bItem.taxWithheld, 'F1099b tax withheld');
};

const validateF1099divItem = (f1099divItem) => {
  if (f1099divItem === null) {
    return;
  }
  if (!isObject(f1099divItem)) {
    throw new ValidationError('F1099div value should be an object or null');
  }
  validateString(f1099divItem.payer, 'F1099div payer');
  validateMoney(f1099divItem.ordDividends, 'F1099div ord dividends');
  validateMoney(f1099divItem.qualDividends, 'F1099div qual dividends');
  validateMoney(f1099divItem.taxWithheld, 'F1099div tax withheld');
  validateMoney(f1099divItem.exemptInterestDiv, 'F1099div exempt interest div');
};

const validateDependentsItem = (dependentsItem) => {
  if (dependentsItem === null) {
    return;
  }
  if (!isObject(dependentsItem)) {
    throw new ValidationError('Dependents value should be an object or null');
  }
  validateString(dependentsItem.name, 'Dependents name');
  validateSSN(dependentsItem.ssn, 'Dependents SSN');
  validateString(dependentsItem.relation, 'Dependents relation');
  validateBoolean(dependentsItem.childCredit, 'Dependents child credit');
};

const validateSubitemInput = (subInput, paramName, subValidator) => {
  if (subInput === undefined) {
    return;
  }
  if (!isObject(subInput)) {
    throw new ValidationError(`${paramName} should be an object`);
  }
  for (const key of Object.keys(subInput)) {
    if (!isString(key)) {
      throw new ValidationError(`${paramName} key should be string`);
    }
    if (!isValidUUID(key)) {
      throw new ValidationError(`${paramName} key is not valid UUID`);
    }
    subValidator(subInput[key]);
  }
};

const validateTaxinfoInput = (taxinfoInput) => {
  validateString(taxinfoInput.lastName, 'Last name');
  validateString(taxinfoInput.firstName, 'First name');
  validateString(taxinfoInput.middleName, 'Middle name');
  validateSSN(taxinfoInput.ssn);
  validateString(taxinfoInput.spouseName, 'Spouse name');
  validateSSN(taxinfoInput.spouseSSN, 'Spouse SSN');
  validateString(taxinfoInput.addr1, 'Address 1');
  validateString(taxinfoInput.addr2, 'Address 2');
  validateString(taxinfoInput.addr3, 'Address 3');
  validateBankAccount(taxinfoInput.bankAccount);
  validateBankRouting(taxinfoInput.bankRouting);
  validateBoolean(taxinfoInput.bankIsChecking, 'Bank is checking');
  validateSubitemInput(taxinfoInput.fw2, 'Fw2', validateFw2Item);
  validateSubitemInput(taxinfoInput.f1099int, 'F1099int', validateF1099intItem);
  validateSubitemInput(taxinfoInput.f1099b, 'F1099b', validateF1099bItem);
  validateSubitemInput(taxinfoInput.f1099div, 'F1099div', validateF1099divItem);
  validateSubitemInput(taxinfoInput.dependents, 'Dependents', validateDependentsItem);
};

module.exports = {
  validateGoogleId,
  isValidationError,
  validateTaxinfoInput,
};
