'use strict';

const express = require('express');
const passport = require('passport');

const config = require('../config');

const router = new express.Router();

router.get('/', (req, res) => {
  res.json(Boolean(req.user));
});

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: config.frontendURL }),
  (req, res) => {
    res.redirect('/auth/redirect');
  },
);

// OAuth trampoline
router.get('/redirect', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.end(`
    <!doctype html>
    <script>location.pathname = ${JSON.stringify(config.frontendURL)};</script>
  `);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(config.frontendURL);
});

module.exports = router;
