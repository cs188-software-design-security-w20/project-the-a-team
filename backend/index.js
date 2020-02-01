'use strict';

const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const uuid = require('uuid');
const credentials = require('./credentials.json');
const User = require('./models/User.js');

const app = express();

passport.use(
  new GoogleStrategy({
    clientID: credentials.clientId,
    clientSecret: credentials.clientSecret,
    callbackURL: 'http://localhost:8080/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    // console.log(accessToken, refreshToken, profile);
    // done(null, profile.id);
    User.findOrCreate({ where: { google_id: profile.id }, defaults: { uuid: uuid.v4() } })
        .then(([user, created]) => {
          console.log('logged in with google id', profile.id);
          done(null, user);
        });
  }
));

app.use(cookieSession({
  secret: credentials.cookieSecret,
  maxAge: 15 * 60 * 1000,
  // secure: true, // enable this after we set up HTTPS
  sameSite: 'strict',
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser( (user, done) => {
  // console.log('serialize user');
  done(null, user.uuid);
});

passport.deserializeUser( (user, done) => {
  User.findOne({ where: { uuid: user } }).then((user) => {
    // console.log('deserialize user');
    done(null, user);
  });
});

app.get('/', (req, res) => {
  res.end('hello');
});

app.get('/main', (req, res) => {
  if (req.user) {
      res.send(`debug: you are logged in with:<br>internal id: ${req.user.id}<br>uuid: ${req.user.uuid}<br>google id ${req.user.google_id}`);
  } else {
    res.send('debug: you are not logged in');
  }
});

app.get('/login', (req, res) => {
  res.end('failed to log in');
});

app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
  }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/main');
  }
);

app.listen(8080, () => {
  console.log('Listening on port 8080');
});
