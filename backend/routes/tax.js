'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const Taxinfo = require('../models/Taxinfo.js');

const router = new express.Router();

router.get('/', async (req, res) => {
  try {
    const [taxinfo] = await Taxinfo.findOrCreate({
      where: { userId: req.user.id },
      attributes: { exclude: ['id', 'userId', 'createdAt', 'updatedAt'] },
    });
    res.json(taxinfo);
  } catch (err) {
    console.log(err);
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
      if (typeof ssn !== 'string') {
        res.status(400).json({ message: 'SSN should be string' });
        return;
      }
      if (!ssn.match(/^\d{9}$/)) {
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
    const [taxinfo] = await Taxinfo.findOrCreate({
      where: { userId: req.user.id },
    });
    taxinfo.update({
      ssn,
      address,
      bankAccount,
      bankRouting,
      bankIsChecking,
    });
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
