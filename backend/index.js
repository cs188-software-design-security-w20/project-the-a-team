'use strict';

require('./models/sync.js');

const { URL } = require('url');
const express = require('express');
const cookieSession = require('cookie-session');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const config = require('./config.json');
const query = require('./service/query.js');
const authRouter = require('./routes/auth.js');
const taxRouter = require('./routes/tax.js');

const app = express();

passport.use(
  new GoogleStrategy({
    clientID: config.credentials.googleClientId,
    clientSecret: config.credentials.googleClientSecret,
    callbackURL: new URL('/auth/google/callback', config.backendURL).href,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const userObj = await query.ensureUserTaxinfo(profile.id);
      done(null, userObj);
    } catch (err) {
      done(err);
    }
  }),
);

app.set('trust proxy', 'loopback, linklocal, uniquelocal');

app.use(cors({
  origin: [new URL(config.frontendURL).origin],
  credentials: true,
}));
app.use(cookieSession({
  secret: config.credentials.cookieSecret,
  maxAge: 15 * 60 * 1000, // 15 min
  secure: new URL(config.backendURL).protocol !== 'http:',
  sameSite: 'strict',
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((userObj, done) => {
  done(null, userObj.uuid);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const userObj = await query.getUserByUUID(userId);
    done(null, userObj);
  } catch (err) {
    done(err);
  }
});

const isPageView = (req) => req.headers.accept && req.headers.accept.includes('text/html');

// check login middleware
const checkLogin = (req, res, next) => {
  if (req.user) {
    next();
  } else if (isPageView(req)) { // Page view
    res.redirect(config.frontendURL);
  } else { // API request
    res.status(401).json({ message: 'Please login' });
  }
};

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  if (req.user) {
    res.end(`
      debug: you are logged in with:<br>
      internal id: ${req.user.id}<br>
      uuid: ${req.user.uuid}<br>
      google id: ${req.user.googleId}
    `);
  } else {
    res.end('debug: you are not logged in');
  }
});

app.get('/must-login', checkLogin, (req, res) => {
  res.set('Content-Type', 'text/html');
  res.end(`
    debug: you should be logged in with:<br>
    internal id: ${req.user.id}<br>
    uuid: ${req.user.uuid}<br>
    google id: ${req.user.googleId}
  `);
});

app.use('/auth', authRouter);
app.use('/tax', checkLogin, taxRouter);

// 404 handler, should be the last handler
app.use((req, res) => {
  if (isPageView(req)) { // Page view
    res.redirect(config.frontendURL);
  } else { // API request
    res.status(404).json({ message: 'Invalid API endpoint or method' });
  }
});

app.listen(8080, () => {
  console.log('Listening on port 8080'); // eslint-disable-line no-console
});
