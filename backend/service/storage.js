'use strict';

const { Storage } = require('@google-cloud/storage');
const uuidv4 = require('uuid/v4');
const config = require('../config.json');

const encryptionKey = Buffer.from(config.credentials.bucketEncryptionSecret, 'base64');
const storage = new Storage({
  credentials: config.credentials.serviceAccount,
});
const bucket = storage.bucket(config.storageBucket);

async function storeFile(srcFilename) {
  const destFilename = `pdf/${uuidv4()}.pdf`;
  await bucket.upload(srcFilename, {
    destination: destFilename,
    encryptionKey,
  });
  return destFilename;
}
exports.storeFile = storeFile;

function getFile(filename) {
  return bucket.file(filename).setEncryptionKey(encryptionKey);
}
exports.getFile = getFile;

async function deleteFile(filename) {
  try {
    await bucket.file(filename).delete();
    console.log(`Deleted file ${filename}`); // eslint-disable-line no-console
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    // We give up.
  }
}
exports.deleteFile = deleteFile;
