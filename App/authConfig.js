/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

require('dotenv').config();

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL Node configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md
 */
const msalConfig = {
  auth: {
    clientId: "Enter_the_Application_Id_Here", // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
    authority: "Enter_the_Cloud_Instance_Id_HereEnter_the_Tenant_Info_Here", // Full directory URL, in the form of https://login.microsoftonline.com/<tenant>
    clientSecret: "Enter_the_Client_Secret_Here" // Client secret generated from the app registration in Azure portal
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

const GRAPH_CONFIG = {
  ENDPOINT: "https://graph.microsoft.com/v1.0/me",
  SCOPES: ["User.Read"]
}

module.exports = {
  msalConfig,
  REDIRECT_URI,
  POST_LOGOUT_REDIRECT_URI,
  GRAPH_CONFIG
};
