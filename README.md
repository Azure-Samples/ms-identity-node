---
page_type: sample
languages:
- javascript
products:
- nodejs
- azure-active-directory
description: "Add authentication to a Node.js web application with the Microsoft Authentication Library for Node.js (MSAL Node)."
urlFragment: "quickstart-v2-nodejs-webapp-msal"
---

# Add user authentication to a Node web app with MSAL

This sample Node.js web application uses the Microsoft Authentication Library for Node.js (MSAL Node.js) to sign in users by using the OAuth 2.0 authorization code flow.

You can find additional information about supporting user sign-in in your web apps by using the Microsoft identity platform on docs.microsoft.com: [Scenario: Web app that signs in users](https://docs.microsoft.com/azure/active-directory/develop/scenario-web-app-sign-user-overview?tabs=aspnetcore).

## Prerequisites

- [Node.js](https://nodejs.org/en/)

## Register the application

First, complete the steps in [Register an application with the Microsoft identity platform](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app) to register the app.

Use the following settings for your app registration:

- Name: `MSAL Node Sample` (suggested)
- Supported account types: **Accounts in any organizational directory and personal Microsoft accounts**
- Platform type: **Web**
- Redirect URI: `http://localhost:3000/redirect`
- Client secret: `*********` (record this value after creation - it's shown only once)

## Clone the repository

Next, get the files included in this code sample.

SSH:

```bash
$ git clone git@github.com:AzureAD/ms-identity-node.git
```

HTTP:

```bash
$ git clone https://github.com/AzureAD/ms-identity-node.git
```

You can also download the repository by selecting **Download ZIP** from the repository's dropdown menu. You can decompress it locally and explore the code.

## Install the package

To install the MSAL Node package:

```bash
npm install @azure/msal-node
```

If you are customizing MSAL Node or building locally:

```bash
npm run build:package
```

## Configure the sample code

Open the *index.js* file and find the `config` object. Modify the `config` object with values from your [app's registration in the Azure portal](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app).

Find your app's registration in the [Azure portal](https://portal.azure.com) and populate the `config` object with the following values:

* `clientId`: **Application (client) ID**
* `authority`: `https://login.microsoftonline.com/common`
* `clientSecret`: `********` (recorded during app registration - see [Prerequisites](#))

You have finished the basic configuration!

> TIP: You can support different account types by specifying other [authority options](https://docs.microsoft.com/azure/active-directory/develop/msal-client-application-configuration). Unless you have a need to restrict users of your app to a single organization, we suggest you use the default authority shown here. User restrictions can be placed later in the application flow if needed.

## Run the sample app

1. From the command line, let npm install any needed dependencies.  This only needs to be done once.

    ```bash
    $ npm install
    ```

1. Once the dependencies are installed, you can run the sample application by using the following command:

    ```bash
    $ npm start
    ```

1. Navigate to http://localhost:3000 (or whatever port number specified) with the browser of your choice.

#### Customize application start

To customize the start script, modify the *package.json* file.

## Add authentication to an existing application

### Import the Configuration Object

If you set up the sample with your app registration, you may be able to copy this object directly into your application.

```js
const config = {
    auth: {
        clientId: "12d77c73-d09d-406a-3asd-3d4e576f7d9b",
        authority: "https://login.microsoftonline.com/common",
        clientSecret: ""
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        }
    }
};
```

### Configure Dependencies

Add the dependency on MSAL Node to your Node app.

```js
const msal = require('@azure/msal-node');
```

### Initialize MSAL Node at runtime

Initialize the app object within your web app.

```js
const pca = new msal.ConfidentialClientApplication(config);
```

### Configure sign-in request

Choose the route that requires sign-in. Within that route, set up permissions and direct the MSAL Node app object to attempt sign-in.

In this code sample, the user is immediately signed-in. If you want all users to be logged in before they view anything, then you can use the same process. Add the sign-in code to the default route:

```js
app.get('/', (req, res) => {
```

Next, pick the `scopes` related to the user. If you're logging in a user, you must at minimum request access to basic user information. The default scope of `user.read` grants that basic access. To learn more, see the [Microsoft Graph permissions reference](https://docs.microsoft.com/graph/permissions-reference).

```js
    const authCodeUrlParameters = {
        scopes: ["user.read"],
        redirectUri: "http://localhost:3000/redirect",
    };
```

The `redirectUri` is the return route. After logging in a user, they'll hit this route. Your application logic will take over here. You'll want to customize the `redirectUri` for your application.

Next, direct the user to authenticate. The following code block directs the user based on the `authority` you set in the config and directs the user as needed.

```js
    pca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
        res.redirect(response);
    }).catch((error) => console.log(JSON.stringify(error)));
```

Putting together the routing and all the logic for starting the sign-in yields the following code:

```js
app.get('/', (req, res) => {
    const authCodeUrlParameters = {
        scopes: ["user.read"],
        redirectUri: "http://localhost:3000/redirect",
    };

    pca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
        res.redirect(response);
    }).catch((error) => console.log(JSON.stringify(error)));
});
```

### Configure sign-in response

The next step occurs after the redirect. Your application must first *complete* the sign-in flow by processing the code and validating the incoming request.

First, configure the route where your app should receive the response. This must match your app registration's configuration in the Azure portal.

```js
app.get('/redirect', (req, res) => {
```

Next, your app logic validates the scopes and route. The `scopes` must match the request and the `redirectUri` must match the **Redirect URI** you configured in the app registration in the Azure portal, as well the route.

```js
    const tokenRequest = {
        code: req.query.code,
        scopes: ["user.read"],
        redirectUri: "http://localhost:3000/redirect",
    };
```

The above code is the *configuration* for validating the response. The following code *validates* the response and completes the sign-in.

```js
    pca.acquireTokenByCode(tokenRequest).then((response) => {
        console.log("\nResponse: \n:", response);
        res.sendStatus(200);
    }).catch((error) => {
        console.log(error);
        res.status(500).send(error);
    });
```

Putting together the routing and all the logic for completing the sign-in yields the following code:

```js
app.get('/redirect', (req, res) => {
    const tokenRequest = {
        code: req.query.code,
        scopes: ["user.read"],
        redirectUri: "http://localhost:3000/redirect",
    };

    pca.acquireTokenByCode(tokenRequest).then((response) => {
        console.log("\nResponse: \n:", response);
        res.sendStatus(200);
    }).catch((error) => {
        console.log(error);
        res.status(500).send(error);
    });
});
```

## The user experience

What happens if the user logs in, closes the window, returns to the site, and logs in again?

Microsoft supports several complex scenarios with several forms of authentication: certificates, hardware keys, federated experiences, and even biometrics in some cases. Let our the Microsoft Authentication Library (MSAL) handle the complexity of deciding the simplest way of logging in the user.

> NOTE: Silent flows are not used with this scenario. See [Authentication flows](https://docs.microsoft.com/azure/active-directory/develop/msal-authentication-flows) for a discussion of the interaction between flows.
