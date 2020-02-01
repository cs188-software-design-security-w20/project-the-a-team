'use strict';

const express = require('express');
const passport = require('passport');

const router = new express.Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/auth/redirect');
  },
);

// OAuth trampoline
router.get('/redirect', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.end(`
    <!doctype html>
    <script>location.pathname = '/';</script>
  `);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
