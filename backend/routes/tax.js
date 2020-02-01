'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const Taxinfo = require('../models/Taxinfo.js');

const router = new express.Router();

router.get('/', (req, res) => {
  // dummy
  Taxinfo.findAll().then((data) => {
    res.json(data);
  });
});

router.post('/', bodyParser.json(), (req, res) => {
  // dummy
  Taxinfo.create({ ssn: req.body.ssn || '123456789' }).then((data) => {
    console.log('created tax info with id', data.id);
    res.end();
  });
});

module.exports = router;
