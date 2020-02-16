'use strict';

const stream = require('stream');
const util = require('util');
const express = require('express');
const bodyParser = require('body-parser');

const query = require('../service/query.js');
const calculation = require('../service/calculation.js');
const storage = require('../service/storage.js');
const converter = require('../utils/conversion.js');
const validator = require('../utils/validation.js');

const pipeline = util.promisify(stream.pipeline);

const router = new express.Router();

router.get('/', async (req, res) => {
  try {
    const {
      taxinfo,
      fw2,
      f1099int,
      f1099b,
      f1099div,
      dependents,
    } = await query.getUserData(req.user);
    const taxinfoJson = taxinfo.toJSON();
    delete taxinfoJson.id;
    const modelObjs = {
      fw2,
      f1099int,
      f1099b,
      f1099div,
      dependents,
    };
    for (const key of Object.keys(modelObjs)) {
      taxinfoJson[key] = modelObjs[key].map((form) => form.toJSON());
    }
    for (const value of taxinfoJson.fw2) {
      value.income = converter.bigintToFloat(value.income);
      value.taxWithheld = converter.bigintToFloat(value.taxWithheld);
    }
    for (const value of taxinfoJson.f1099int) {
      value.income = converter.bigintToFloat(value.income);
      value.usSavingTreasInterest = converter.bigintToFloat(value.usSavingTreasInterest);
      value.taxWithheld = converter.bigintToFloat(value.taxWithheld);
      value.taxExemptInterest = converter.bigintToFloat(value.taxExemptInterest);
    }
    for (const value of taxinfoJson.f1099b) {
      value.proceeds = converter.bigintToFloat(value.proceeds);
      value.basis = converter.bigintToFloat(value.basis);
      value.taxWithheld = converter.bigintToFloat(value.taxWithheld);
    }
    for (const value of taxinfoJson.f1099div) {
      value.ordDividends = converter.bigintToFloat(value.ordDividends);
      value.qualDividends = converter.bigintToFloat(value.qualDividends);
      value.taxWithheld = converter.bigintToFloat(value.taxWithheld);
      value.exemptInterestDiv = converter.bigintToFloat(value.exemptInterestDiv);
    }
    res.json(taxinfoJson);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', bodyParser.json(), async (req, res) => {
  try {
    await query.updateUserData(req.user, req.body);
    res.status(204).end();
  } catch (err) {
    if (validator.isValidationError(err)) {
      res.status(400).json({ message: err.message });
      return;
    }
    console.error(err); // eslint-disable-line no-console
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/', async (req, res) => {
  try {
    await query.clearUserData(req.user);
    res.status(204).end();
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.status(500).json({ message: 'Server error' });
  }
});

function makeLocked(cb) {
  const map = new Map();
  return async (user) => {
    if (map.has(user.id)) {
      return map.get(user.id);
    }
    const promise = cb(user);
    map.set(user.id, promise);
    try {
      await promise;
    } finally {
      map.delete(user.id);
    }
    return promise;
  };
}

const lockedFillAndSave = makeLocked(calculation.fillAndSave);

router.get('/pdf', async (req, res) => {
  try {
    const fname = req.user.pdfResult ? req.user.pdfResult : await lockedFillAndSave(req.user);
    const file = storage.getFile(fname);
    // This is race condition-prone, as we should use createReadStream directly to find out
    // if the file exists. However, doing so is deemed to be difficult, so we punt on that for now.
    const [exist] = await file.exists();
    if (!exist) throw new Error('File should exist!!!!');
    res.set('Content-Type', 'application/pdf');
    await pipeline(file.createReadStream(), res);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    try {
      res.set('Content-Type', 'text/html');
      res.status(500).end('PDF file not available');
    } catch (err2) {
      console.error('We couldn\'t send error:', err2); // eslint-disable-line no-console
      // We give up.
    }
  }
});

module.exports = router;
