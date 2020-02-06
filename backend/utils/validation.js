'use strict';

const isBoolean = (obj) => typeof obj === 'boolean';
const isString = (obj) => typeof obj === 'string';
const isObject = (obj) => typeof obj === 'object';
const isNonNegativeInteger = (obj) => Number.isInteger(obj) && obj >= 0;
const isInLengthLimit = (s) => s.length <= 255;
const isDigitOnly = (s) => s.match(/^\d*$/);
const isValidSSN = (s) => s.match(/^\d{9}$/);
const isValidUUID = (s) => s.match(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/);

class ValidationError {
  constructor(message) {
    this.message = message;
  }
}

const isValidationError = (obj) => obj instanceof ValidationError;

module.exports = {
  isBoolean,
  isString,
  isObject,
  isNonNegativeInteger,
  isInLengthLimit,
  isDigitOnly,
  isValidSSN,
  isValidUUID,
  ValidationError,
  isValidationError,
};
