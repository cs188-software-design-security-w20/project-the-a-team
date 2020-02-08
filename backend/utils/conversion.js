'use strict';

const floatToBigint = (x) => (x === null ? null : Math.round(x * 100));
const bigintToFloat = (x) => (x === null ? null : parseInt(x, 10) / 100);

module.exports = {
  floatToBigint,
  bigintToFloat,
};
