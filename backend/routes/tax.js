'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const { sequelize } = require('../models/database.js');
const Taxinfo = require('../models/Taxinfo.js');
const Fw2 = require('../models/Fw2.js');
const F1099int = require('../models/F1099int.js');
const F1099b = require('../models/F1099b.js');
const F1099div = require('../models/F1099div.js');
const Dependents = require('../models/Dependents.js');
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
    } = await sequelize.transaction(async (t) => {
      const ttaxinfo = await Taxinfo.findOne({
        where: { userId: req.user.id },
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
        transaction: t,
      });
      const [
        tfw2,
        tf1099int,
        tf1099b,
        tf1099div,
        tdependents,
      ] = await Promise.all([
        Fw2.findAll({
          where: { taxinfoId: ttaxinfo.id },
          attributes: { exclude: ['id', 'taxinfoId', 'createdAt', 'updatedAt'] },
          transaction: t,
        }),
        F1099int.findAll({
          where: { taxinfoId: ttaxinfo.id },
          attributes: { exclude: ['id', 'taxinfoId', 'createdAt', 'updatedAt'] },
          transaction: t,
        }),
        F1099b.findAll({
          where: { taxinfoId: ttaxinfo.id },
          attributes: { exclude: ['id', 'taxinfoId', 'createdAt', 'updatedAt'] },
          transaction: t,
        }),
        F1099div.findAll({
          where: { taxinfoId: ttaxinfo.id },
          attributes: { exclude: ['id', 'taxinfoId', 'createdAt', 'updatedAt'] },
          transaction: t,
        }),
        Dependents.findAll({
          where: { taxinfoId: ttaxinfo.id },
          attributes: { exclude: ['id', 'taxinfoId', 'createdAt', 'updatedAt'] },
          transaction: t,
        }),
      ]);
      return {
        taxinfo: ttaxinfo,
        fw2: tfw2,
        f1099int: tf1099int,
        f1099b: tf1099b,
        f1099div: tf1099div,
        dependents: tdependents,
      };
    });
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
    res.json(taxinfoJson);
  } catch (err) {
    console.log(err); // eslint-disable-line no-console
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', bodyParser.json(), async (req, res) => {
  try {
    const {
      ssn,
      address,
      bankAccount,
      bankRouting,
      bankIsChecking,
    } = req.body;
    if (ssn !== undefined) {
      if (!validator.isString(ssn)) {
        throw new validator.ValidationError('SSN should be string');
      }
      if (ssn && !validator.isValidSSN(ssn)) {
        throw new validator.ValidationError('SSN should be 9 digits');
      }
    }
    if (address !== undefined) {
      if (!validator.isString(address)) {
        throw new validator.ValidationError('Address should be string');
      }
      if (!validator.isInLengthLimit(address)) {
        throw new validator.ValidationError('Address too long');
      }
    }
    if (bankAccount !== undefined) {
      if (!validator.isString(bankAccount)) {
        throw new validator.ValidationError('Bank account should be string');
      }
      if (!validator.isDigitOnly(bankAccount)) {
        throw new validator.ValidationError('Bank account should only contain digits');
      }
      if (!validator.isInLengthLimit(bankAccount)) { // TODO: further verify length?
        throw new validator.ValidationError('Bank account too long');
      }
    }
    if (bankRouting !== undefined) {
      if (!validator.isString(bankRouting)) {
        throw new validator.ValidationError('Bank routing should be string');
      }
      if (!validator.isDigitOnly(bankRouting)) {
        throw new validator.ValidationError('Bank routing should only contain digits');
      }
      if (!validator.isInLengthLimit(bankRouting)) { // TODO: further verify length?
        throw new validator.ValidationError('Bank routing too long');
      }
    }
    if (bankIsChecking !== undefined) {
      if (!validator.isBoolean(bankIsChecking)) {
        throw new validator.ValidationError('Bank is checking should be boolean');
      }
    }
    await sequelize.transaction(async (t) => {
      const taxinfo = await Taxinfo.findOne({
        where: { userId: req.user.id },
        transaction: t,
      });
      await taxinfo.update({
        ssn,
        address,
        bankAccount,
        bankRouting,
        bankIsChecking,
      }, { transaction: t });
    });
    res.status(204).end();
  } catch (err) {
    if (validator.isValidationError(err)) {
      res.status(400).json({ message: err.message });
      return;
    }
    console.log(err); // eslint-disable-line no-console
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
