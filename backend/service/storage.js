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

function getFileStream(filename) {
  return bucket.file(filename).setEncryptionKey(encryptionKey).createReadStream();
}
exports.getFileStream = getFileStream;

async function deleteFile(fname) {
  await bucket.file(fname).delete();
}
exports.deleteFile = deleteFile;
