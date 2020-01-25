'use strict';
const express = require('express');
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

app.get('/', (req, res) => {
  res.end('hello');
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
	passport.authenticate('google', { failureRedirect: '/' }),
	(req, res) => {
		res.redirect('/');
	}
);

app.listen(8080, () => {
  console.log('Listening on port 8080');
});
