---
page_type: sample
languages:
- javascript
- nodejs
products:
- msal-node
- azure-active-directory
description: "Add authentication to a Node.js web application with the Microsoft Authentication Library for Node.js (MSAL Node)."
urlFragment: "ms-identity-node"
---

# Express web application built with MSAL Node and Microsoft identity platform

This sample demonstrates how to use [MSAL Node](https://www.npmjs.com/package/@azure/msal-node) to login, logout and acquire an access token for a protected resource such as Microsoft Graph.

## Features

This sample demonstrates the following MSAL Node concepts:

- Configuration
- Login
- Logout
- Acquiring an access token and calling Microsoft Graph

## Contents

| File/folder       | Description                                |
|-------------------|--------------------------------------------|
| `App/`            | Application source code resides here.      |
| `AppCreationScripts/` | Contains PowerShell scripts for automating app registration.      |
| `.gitignore`      | Define what to ignore at commit time.      |
| `CHANGELOG.md`    | List of changes to the sample.             |
| `CONTRIBUTING.md` | Guidelines for contributing to the sample. |
| `README.md`       | This README file.                          |
| `LICENSE`         | The license for the sample.                |

**Note:** This sample was bootstrapped using [express-generator](https://expressjs.com/en/starter/generator.html).

## Getting Started

### Prerequisites

[Node.js](https://nodejs.org/en/) must be installed to run this sample.

### Setup

1. Register a new application by following the steps shown [here](https://docs.microsoft.com/azure/active-directory/develop/web-app-quickstart?pivots=devlang-nodejs-msal#step-1-register-your-application)
1. Clone this repository `git clone https://github.com/Azure-Samples/ms-identity-node.git`
1. Open the [/App/.env](./App/.env) file and provide the required configuration values
1. On the command line, navigate to the `App` folder, and run`npm install` to install the project dependencies via npm

## Running the sample

1. Configure authentication and authorization parameters:
   1. Open `App/.env`
   1. Replace the string `"Enter_the_Application_Id_Here"` with your app/client ID on AAD Portal.
   1. Replace the string `"Enter_the_Cloud_Instance_Id_Here"` with `"https://login.microsoftonline.com/"`
   1. Replace the string `"Enter_the_Tenant_Info_Here"` with your tenant ID on AAD Portal.
   1. Replace the string `"Enter_the_Client_Secret_Here"` with your client secret on AAD Portal.
1. Configure the parameters for calling MS Graph API:
   1. Replace the string `"Enter_the_Graph_Endpoint_Here"` with `"https://graph.microsoft.com/"`
1. Configure the Express session secret:
   1. Replace the string `"Enter_the_Express_Session_Secret_Here"` with a hard to guess value, such as your client secret.
1. To start the sample application, run `npm start`.
1. Finally, open a browser and navigate to [http://localhost:3000](http://localhost:3000).

> :information_source: To configure this app for tenants on Sovereign/National clouds, see: [Use MSAL in a national cloud environment](https://docs.microsoft.com/azure/active-directory/develop/msal-national-cloud)

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit <https://cla.opensource.microsoft.com>.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
