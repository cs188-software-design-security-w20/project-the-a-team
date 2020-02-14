// Derived from https://github.com/pdffillerjs/pdffiller/blob/d4529703c29bba5d562bd15bf78bfdee209a2ae7/index.js.
// Licensed under the MIT license.

'use strict';

const childProcess = require('child_process');
const fs = require('fs').promises;
const { promisify } = require('util');
const generateFDF = require('./fdf-generator.js');

const execFile = promisify(childProcess.execFile);

module.exports = async (srcFile, destFile, fields) => {
  const formData = generateFDF(fields);
  const fdfFile = `${destFile}.fdf`;
  try {
    await fs.writeFile(fdfFile, formData);
    await execFile('pdftk', [srcFile, 'fill_form', fdfFile, 'output', destFile]);
  } finally {
    await fs.unlink(fdfFile);
  }
};
