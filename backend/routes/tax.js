'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const query = require('../service/query.js');
const converter = require('../utils/conversion.js');
const validator = require('../utils/validation.js');

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

module.exports = router;
