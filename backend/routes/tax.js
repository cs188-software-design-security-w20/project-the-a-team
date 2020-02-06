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
      fw2,
    } = req.body;
    if (ssn !== undefined) {
      if (typeof ssn !== 'string') {
        res.status(400).json({ message: 'SSN should be string' });
        return;
      }
      if (ssn && !ssn.match(/^\d{9}$/)) {
        res.status(400).json({ message: 'SSN should be 9 digits' });
        return;
      }
    }
    if (address !== undefined) {
      if (typeof address !== 'string') {
        res.status(400).json({ message: 'Address should be string' });
        return;
      }
      if (address.length > 255) {
        res.status(400).json({ message: 'Address too long' });
        return;
      }
    }
    if (bankAccount !== undefined) {
      if (typeof bankAccount !== 'string') {
        res.status(400).json({ message: 'Bank account should be string' });
        return;
      }
      if (!bankAccount.match(/^\d*$/)) {
        res.status(400).json({ message: 'Bank account should only contain digits' });
        return;
      }
      if (bankAccount.length > 255) { // TODO: further verify length?
        res.status(400).json({ message: 'Bank account too long' });
        return;
      }
    }
    if (bankRouting !== undefined) {
      if (typeof bankRouting !== 'string') {
        res.status(400).json({ message: 'Bank routing should be string' });
        return;
      }
      if (!bankRouting.match(/^\d*$/)) {
        res.status(400).json({ message: 'Bank routing should only contain digits' });
        return;
      }
      if (bankRouting.length > 255) { // TODO: further verify length?
        res.status(400).json({ message: 'Bank routing too long' });
        return;
      }
    }
    if (bankIsChecking !== undefined) {
      if (typeof bankIsChecking !== 'boolean') {
        res.status(400).json({ message: 'Bank is checking should be boolean' });
        return;
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
      const fw2s = [];
      for (const key of Object.keys(fw2)) {
        fw2s.push(Fw2.findOne({
          where: { taxinfoId: taxinfo.id, uuid: key },
          transaction: t,
        }));
      }
      for (const form of await Promise.all(fw2s)) {
        form.update({
          employer: fw2.employer,
          income: fw2.income,
          taxWithheld: fw2.taxWithheld,
        }, { transaction: t });
      }
    });
    res.status(204).end();
  } catch (err) {
    console.log(err); // eslint-disable-line no-console
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
