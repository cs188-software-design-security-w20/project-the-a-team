'use strict';

const floatToBigint = (x) => ([undefined, null].includes(x) ? x : Math.round(x * 100));
const bigintToFloat = (x) => (x === null ? null : parseInt(x, 10) / 100);

module.exports = {
  floatToBigint,
  bigintToFloat,
};
