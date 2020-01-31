'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const credentials = require('./credentials.json');
const Taxinfo = require('./models/Taxinfo.js');

const app = express();

passport.use(
  new GoogleStrategy({
    clientID: credentials.clientId,
    clientSecret: credentials.clientSecret,
    callbackURL: 'http://localhost:8080/auth/google/callback',
  },
  (accessToken, refreshToken, profile, done) => {
    console.log(accessToken, refreshToken, profile);
    done(null, '1');
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
  }),
);

app.use(passport.initialize());

app.get('/', (req, res) => {
  res.end('hello');
});

app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true,
  }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  },
);

app.get('/taxinfo', (req, res) => {
  // dummy
  Taxinfo.findAll().then((data) => {
    res.json(data);
  });
});

app.post('/taxinfo', bodyParser.json(), (req, res) => {
  // dummy
  Taxinfo.create({ ssn: req.body.ssn || '123456789' }).then((data) => {
    console.log('created tax info with id', data.id);
    res.end();
  });
});

app.listen(8080, () => {
  console.log('Listening on port 8080');
});
