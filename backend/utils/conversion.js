'use strict';

const floatToBigint = (x) => Math.round(x * 100);
const bigintToFloat = (x) => parseInt(x, 10) / 100;

module.exports = {
  floatToBigint,
  bigintToFloat,
};
