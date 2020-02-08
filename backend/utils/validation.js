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

class ValidationError {
  constructor(message) {
    this.message = message;
  }
}

const isValidationError = (obj) => obj instanceof ValidationError;

const validateSSN = (ssn, paramName = 'SSN') => {
  if (ssn === undefined) {
    return;
  }
  if (!isString(ssn)) {
    throw new ValidationError(`${paramName} should be string`);
  }
  if (ssn && !isValidSSN(ssn)) {
    throw new ValidationError(`${paramName} should be 9 digits`);
  }
};

const validateAddress = (address, paramName = 'Address') => {
  if (address === undefined) {
    return;
  }
  if (!isString(address)) {
    throw new ValidationError(`${paramName} should be string`);
  }
  if (!isInStringLimit(address)) {
    throw new ValidationError(`${paramName} is too long`);
  }
};

const validateBankAccount = (bankAccount, paramName = 'Bank account') => {
  if (bankAccount === undefined) {
    return;
  }
  if (!isString(bankAccount)) {
    throw new ValidationError(`${paramName} should be string`);
  }
  if (!isDigitOnly(bankAccount)) {
    throw new ValidationError(`${paramName} should only contain digits`);
  }
  if (!isInStringLimit(bankAccount)) { // TODO: further verify length?
    throw new ValidationError(`${paramName} is too long`);
  }
};

const validateBankRouting = (bankRouting, paramName = 'Bank routing') => {
  if (bankRouting === undefined) {
    return;
  }
  if (!isString(bankRouting)) {
    throw new ValidationError(`${paramName} should be string`);
  }
  if (!isDigitOnly(bankRouting)) {
    throw new ValidationError(`${paramName} should only contain digits`);
  }
  if (!isInStringLimit(bankRouting)) { // TODO: further verify length?
    throw new ValidationError(`${paramName} is too long`);
  }
};

const validateBoolean = (obj, paramName) => {
  if (obj === undefined) {
    return;
  }
  if (!isBoolean(obj)) {
    throw new ValidationError(`${paramName} should be boolean`);
  }
};

const validateEmployer = (employer, paramName) => {
  if (employer === undefined) {
    return;
  }
  if (!isString(employer)) {
    throw new ValidationError(`${paramName} should be string`);
  }
  if (!isInStringLimit(employer)) {
    throw new ValidationError(`${paramName} is too long`);
  }
};

const validateMoney = (money, paramName) => {
  if (money === undefined) {
    return;
  }
  if (!isNumber(money)) {
    throw new ValidationError(`${paramName} should be a number`);
  }
  if (!isInMoneyLimit(money)) {
    throw new ValidationError(`${paramName} out of range`);
  }
};

const validateFw2Item = (fw2Item) => {
  if (fw2Item === null) {
    return;
  }
  if (!isObject(fw2Item)) {
    throw new ValidationError('Fw2 value should be an object or null');
  }
  validateEmployer(fw2Item.employer, 'Fw2 employer');
  validateMoney(fw2Item.income, 'Fw2 income');
  validateMoney(fw2Item.taxWithheld, 'Fw2 tax withheld');
};

const validateFw2Input = (fw2Input) => {
  if (fw2Input === undefined) {
    return;
  }
  if (!isObject(fw2Input)) {
    throw new ValidationError('Fw2 should be an object');
  }
  for (const key of Object.keys(fw2Input)) {
    if (!isString(key)) {
      throw new ValidationError('Fw2 key should be string');
    }
    if (!isValidUUID(key)) {
      throw new ValidationError('Fw2 key is not valid UUID');
    }
    validateFw2Item(fw2Input[key]);
  }
};

const validateTaxinfoInput = (taxinfoInput) => {
  validateSSN(taxinfoInput.ssn);
  validateAddress(taxinfoInput.address);
  validateBankAccount(taxinfoInput.bankAccount);
  validateBankRouting(taxinfoInput.bankRouting);
  validateBoolean(taxinfoInput.bankIsChecking, 'Bank is checking');
  validateFw2Input(taxinfoInput.fw2);
};

module.exports = {
  isValidationError,
  validateTaxinfoInput,
};
