'use strict';

const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const credentials = require('./credentials.json');

const app = express();

passport.use(
  new GoogleStrategy({
    clientID: credentials.clientId,
    clientSecret: credentials.clientSecret,
    callbackURL: 'http://localhost:8080/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    console.log(accessToken, refreshToken, profile);
    done(null, '1');
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
  }
));

app.use(cookieSession({
  secret: 'cookie',
  maxAge: 15 * 60 * 1000,
  sameSite: 'strict',
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser( (user, done) => {
  done(null, user);
});

passport.deserializeUser( (user, done) => {
  done(null, user);
});

app.get('/', (req, res) => {
  res.end('hello');
});

app.get('/main', (req, res) => {
  res.end('logged in');
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
