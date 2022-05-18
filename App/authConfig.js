
const msalConfig = {
  auth: {
    clientId: "4fdaa95c-7cfe-48cd-9def-16db8954e3a2",
    authority: "https://login.microsoftonline.com/cbaf2168-de14-4c72-9d88-f5f05366dbef",
    clientSecret: "DZF8Q~IIjGeQkhzZ_AFR.N_rxGdY_fPrHmVrdc.q"
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: "Info",
    }
  }
}


const REDIRECT_URI = "http://localhost:3000/auth/redirect";
const POST_LOGOUT_REDIRECT_URI = "http://localhost:3000/";

module.exports = {
  msalConfig,
  REDIRECT_URI,
  POST_LOGOUT_REDIRECT_URI
};
