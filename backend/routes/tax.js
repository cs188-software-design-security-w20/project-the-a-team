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
    taxinfoJson.fw2.forEach((value) => {
      // eslint-disable-next-line no-param-reassign
      value.income = converter.bigintToFloat(value.income);
      // eslint-disable-next-line no-param-reassign
      value.taxWithheld = converter.bigintToFloat(value.taxWithheld);
    });
    res.json(taxinfoJson);
  } catch (err) {
    console.log(err); // eslint-disable-line no-console
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', bodyParser.json(), async (req, res) => {
  try {
    validator.validateTaxinfoInput(req.body);
    await sequelize.transaction(async (t) => {
      const taxinfo = await Taxinfo.findOne({
        where: { userId: req.user.id },
        transaction: t,
      });
      await taxinfo.update({
        ssn: req.body.ssn,
        address: req.body.address,
        bankAccount: req.body.bankAccount,
        bankRouting: req.body.bankRouting,
        bankIsChecking: req.body.bankIsChecking,
      }, { transaction: t });
      const fw2Promises = [];
      for (const key of Object.keys(req.body.fw2)) {
        fw2Promises.push((async () => {
          if (req.body.fw2[key] === null) {
            return Fw2.destroy({
              where: { taxinfoId: taxinfo.id, uuid: key.toLowerCase() },
              transaction: t,
            });
          }
          const [form] = await Fw2.findOrCreate({
            where: { taxinfoId: taxinfo.id, uuid: key.toLowerCase() },
            transaction: t,
          });
          return form.update({
            employer: req.body.fw2[key].employer,
            income: converter.floatToBigint(req.body.fw2[key].income),
            taxWithheld: converter.floatToBigint(req.body.fw2[key].taxWithheld),
          }, { transaction: t });
        })());
      }
      return Promise.all(fw2Promises);
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
