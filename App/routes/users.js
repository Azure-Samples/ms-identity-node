var express = require('express');
var router = express.Router();

var fetch = require('../utils/fetch');

// custom middleware to check auth state
function isAuthenticated(req, res, next) {
  if (!req.session.isAuthenticated) {
    return res.redirect('/auth/signin'); // redirect to sign-in route
  }

  next();
};

router.get('/id',
  isAuthenticated, // check if user is authenticated
  async function (req, res, next) {
    res.render('id', { idTokenClaims: req.session.account.idTokenClaims });
  }
);

router.get('/profile',
  isAuthenticated, // check if user is authenticated
  async function (req, res, next) {
    const graphResponse = await fetch('https://graph.microsoft.com/v1.0/me', req.session.accessToken);
    res.render('profile', { profile: graphResponse });
  }
);

module.exports = router;
