
const msalConfig = {
  auth: {
    clientId: "Enter_the_Application_Id_Here",
    authority: "Enter_the_Cloud_Instance_Id_HereEnter_the_Tenant_Info_Here",
    clientSecret: "Enter_the_Client_Secret_Here"
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
