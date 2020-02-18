'use strict';

const crypto = require('crypto');
const key = Buffer.from(require('../config.js').credentials.cellEncryptionSecret, 'base64');

const encryptData = (plaintext) => {
  if ([undefined, null, ''].includes(plaintext)) {
    return plaintext;
  }
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let enc = cipher.update(plaintext, 'utf8', 'base64');
  enc += cipher.final('base64');
  return [iv.toString('base64'), enc, cipher.getAuthTag().toString('base64')].join('|');
};

const decryptData = (ciphertext) => {
  if ([undefined, null, ''].includes(ciphertext)) {
    return ciphertext;
  }
  const parts = ciphertext.split('|');
  if (parts.length !== 3) {
    throw new Error('Malformed ciphertext');
  }
  const [iv, enc, tag] = parts;
  const cipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'base64'));
  cipher.setAuthTag(Buffer.from(tag, 'base64'));
  let plaintext = cipher.update(enc, 'base64', 'utf8');
  plaintext += cipher.final('utf8');
  return plaintext;
};

module.exports = {
  encryptData,
  decryptData,
};
