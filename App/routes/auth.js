var express = require('express');
var msal = require('@azure/msal-node');

var { msalConfig, REDIRECT_URI, POST_LOGOUT_REDIRECT_URI } = require('../authConfig');

const router = express.Router();
const msalInstance = new msal.ConfidentialClientApplication(msalConfig);
const cryptoProvider = new msal.CryptoProvider();

const redirectToAuthCodeUrl = async (req, res, next, requestParams) => {

  // prepare the request for the new auth code flow
  req.session.authCodeUrlRequest = {
    redirectUri: REDIRECT_URI,
    scopes: [],
    responseMode: 'form_post', // recommended for confidential clients
  };

  req.session.tokenRequest = {
    redirectUri: REDIRECT_URI,
    scopes: [],
    code: ""
  };

  // prepare the request
  req.session.authCodeUrlRequest.state = requestParams.state;

  // Generate PKCE Codes before starting the authorization flow
  const { verifier, challenge } = await cryptoProvider.generatePkceCodes();

  // Set generated PKCE codes and method as session vars
  req.session.pkceCodes = {
    challengeMethod: 'S256',
    verifier: verifier,
    challenge: challenge,
  };

  // Add PKCE code challenge and challenge method to authCodeUrl request object
  req.session.authCodeUrlRequest.codeChallenge = req.session.pkceCodes.challenge;
  req.session.authCodeUrlRequest.codeChallengeMethod = req.session.pkceCodes.challengeMethod;

  req.session.authCodeUrlRequest.scopes = requestParams.scopes;
  req.session.tokenRequest.scopes = requestParams.scopes;

  // Get url to sign user in and consent to scopes needed for application
  try {
    const authCodeUrlResponse = await msalInstance.getAuthCodeUrl(req.session.authCodeUrlRequest);
    res.redirect(authCodeUrlResponse);
  } catch (error) {
    next(error);
  }
};

router.get('/signin', async function (req, res, next) {

  // create a GUID for crsf
  req.session.csrfToken = cryptoProvider.createNewGuid();

  /**
   * We manipulate these two request objects below
   * to acquire a token with the appropriate claims
   */

  if (!req.session["authCodeRequest"]) {
    req.session.authCodeRequest = {
      authority: "",
      scopes: [],
      state: "",
      redirectUri: "",
    };
  }

  if (!req.session["tokenRequest"]) {
    req.session.tokenRequest = {
      authority: "",
      scopes: [],
      redirectUri: "",
      code: "",
    };
  }

  // encode the state param
  const state = cryptoProvider.base64Encode(
    JSON.stringify({
      csrfToken: req.session.csrfToken,
      redirectTo: '/'
    })
  );

  const requestParams = {
    state: state,
    scopes: [], // by default, MSAL Node will add OIDC scopes to the request
  };

  return redirectToAuthCodeUrl(req, res, next, requestParams)
});

router.get('/acquireToken', async function (req, res, next) {

  // create a GUID for csrf
  req.session.csrfToken = cryptoProvider.createNewGuid();

  // encode the state param
  const state = cryptoProvider.base64Encode(
    JSON.stringify({
      csrfToken: req.session.csrfToken,
      redirectTo: '/profile'
    })
  );

  const requestParams = {
    state: state,
    scopes: ["User.Read"],
  };

  return redirectToAuthCodeUrl(req, res, next, requestParams)
});

router.post('/redirect', async function (req, res) {
  if (req.body.state) {
    const state = JSON.parse(cryptoProvider.base64Decode(req.body.state));

    // check if csrfToken matches
    if (state.csrfToken === req.session.csrfToken) {
      req.session.tokenRequest.code = req.body.code; // authZ code
      req.session.tokenRequest.codeVerifier = req.session.pkceCodes.verifier // PKCE Code Verifier

      try {
        const tokenResponse = await msalInstance.acquireTokenByCode(req.session.tokenRequest);

        req.session.accessToken = tokenResponse.accessToken;
        req.session.idToken = tokenResponse.idToken;
        req.session.account = tokenResponse.account;
        req.session.isAuthenticated = true;

        res.redirect(state.redirectTo); // redirect to home page
      } catch (error) {
        next(error);
      }
    } else {
      res.status(500).send('State does not match!');
    }
  } else {
    res.status(500).send('State is missing!');
  }
});

router.get('/signout', function (req, res) {
  /**
   * Construct a logout URI and redirect the user to end the
   * session with Azure AD/B2C. For more information, visit:
   * https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#send-a-sign-out-request
   */
  const logoutUri = `${msalConfig.auth.authority}/oauth2/v2.0/logout?post_logout_redirect_uri=${POST_LOGOUT_REDIRECT_URI}`;

  req.session.destroy(() => {
    res.redirect(logoutUri);
  });
});

module.exports = router;
