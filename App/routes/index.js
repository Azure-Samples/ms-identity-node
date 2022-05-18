var express = require('express');

var authRouter = require('./auth');
var fetch = require('../utils/fetch');

var router = express.Router();

// custom middleware to check auth state
const isAuthenticated = (req, res, next) => {
  if (!req.session.isAuthenticated) {
    return res.redirect('/auth/signin'); // redirect to signin route
  }

  next();
};

router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'MSAL Node & Express Web App',
    isAuthenticated: req.session.isAuthenticated,
    username: req.session.account?.username,
  });
});

router.get('/profile',
  isAuthenticated, // check if user is authenticated
  async (req, res, next) => {
    const graphResponse = await fetch('https://graph.microsoft.com/v1.0/me', req.session.accessToken);
    res.render('profile', { profile: JSON.stringify(graphResponse) });
  });

router.use('/auth', authRouter);

module.exports = router;
