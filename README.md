![vv-banner.png](./docs/images/vv-call-desktop.png)

# Azure Communication Services Virtual Visits

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fvvartifactstoragedev.blob.core.windows.net%2Flatest%2Feditableazuredeploy.json)

Azure Communication Services Virtual Visits is a web app you can host to
provide your customers with a branded virtual consultation experience.

## Features

- Lobby, calling, and chat experiences for your clients. Browser-based and
  mobile-friendly, clients won't need to install any apps.
- Quick customization options for colors, themes, and features via a .json
  config file.
- Integration with Microsoft Teams. Let your staff host and join meetings using
  familiar Teams UI, while the clients join the same call via your custom
  branded web app.
- Integration with Microsoft Bookings. Configure Bookings to allow your clients
  to schedule appointments and receive join links to your own hosted app.
- Open source and customizable meeting UI controls. The app is built using
  [ACS UI Library](https://github.com/Azure/communication-ui-library) which has
  many options for customizing layouts, rendering, and behaviors.

## Getting Started

There are two ways to start using this app:

- Use the Azure Communication Services Sample Builder. The Sample Builder
  is a wizard that lets you quickly make common customization choices, set up
  Microsoft Bookings integration, and deploy the app to your Azure
  subscription. See [here](./docs/ACS-Builder.md) for more information about
  the Builder.
- Configure and deploy manually. Follow the rest of this readme to learn how
  to get up and running locally, create a new Azure deployment, or update an
  existing one.

## Code Structure

- /client: frontend client.
- /server: server app.
- /deploy: ARM templates and scripts for quick Azure deployment.
- /config: sample configuration file and schema description. The config file
  contains customization settings that can be done without changing the app:
  themes and colors, text captions, and feature toggles.
- /docs: TBD

## Local Setup

### Prerequisites

- Create an Azure account with an active subscription. For details, see
  [Create an account for free](https://azure.microsoft.com/free/).
- [Node.js (12.18.4 and above)](https://nodejs.org/en/download/)
- An active Communication Services resource. [Create a Communication Services resource](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource).

### Install Dependencies

- Run `npm i` from both the client and server folders to install the dependencies for each project.

### Build and Run

Development mode:

- This runs the client and server with hot reload enabled (webpackdevserver for client and ts-node-dev for server).
- Run these commands from either the server folder or client folder.
- The client will be running on port 3000 and the server will be running on port 8080.
- Use the client port 3000 to access the different routes for example localhost:3000/book and localhost:3000/visit
- Use the server port 8080 to access server APIs.

```
npm run build:project
npm run start:project
```

Production mode:

- This runs the client and server as a single application.
- Unlike development mode, the server will serve both the routes and the server APIs.
- The server will be running on port 8080. For example localhost:8080/book and localhost:8080/visit.
- The built files will be put in the location YOUR_REPO_ROOT/dist and the server will be started from this location.

```
npm run package
npm run start:prod
```

Individual builds:

- You can also build the client or server individually.
- For the server run this inside the server folder:

```
npm run build:server
```

- For the client run this inside the client folder.

```
npm run build:client
```

Individual launch:

- You can also launch the client or server in development mode individually.
- For the server, run this inside the server folder. For server individual launch, there won't be access to client routes
  but you can still access the server APIs like /config.

```
npm run start:server
```

- For the client, run this inside the client folder. For client individual launch, if the server is not running, access to client routes is limited.

```
npm run start:client
```

### Environment Variables

- The server retrieves the config to use from the environment variables. On local machines you'll have to set this up
  manually. For deploy to Azure button, the ARM template will set this up for you.
- The environment variables currently used in the config are:
- `VV_COMMUNICATION_SERVICES_CONNECTION_STRING`. [Learn more about how to access your ACS connection string.](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/create-communication-resource?tabs=windows&pivots=platform-azp#access-your-connection-strings-and-service-endpoints) Example value: "endpoint=https://test.westus.communications.azure.com/;accesskey=SAMPLEKEY1234"
- `VV_MICROSOFT_BOOKINGS_URL`. Example value: "https://microsoftbookings.azurewebsites.net/?organization=financialservices&UICulture=en-US&CallBackURL=https%3A%2F%2Fproducts.office.com/business/bookings".
- `VV_CHAT_ENABLED`. Example value: "true".
- `VV_SCREENSHARE_ENABLED`. Example value: "true".
- `VV_COMPANY_NAME`. Example value: "Lamna Healthcare".
- `VV_COLOR_PALETTE`. Example value: "#0078d4".
- `VV_WAITING_TITLE`. Example value: "Thank you for choosing Lamna Healthcare".
- `VV_WAITING_SUBTITLE`. Example value: "Your clinician is joining the meeting".
- `VV_LOGO_URL`. Example value: "https://your_cdn/logo.png".

## Quick Deploy to Azure

TBD

## Updating Your Sample

Once a new release is published in this repo, you can update your deployed app
with the latest package using [Azure CLI](https://docs.microsoft.com/cli/azure/webapp/deployment/source?view=azure-cli-latest#az_webapp_deployment_source_config_zip).

For example:

- Download new `release.zip`
- Deploy using Azure CLI:

  ```shell
  az webapp deployment source config-zip --resource-group <group-name> --name <app-name> --src <path-to-release.zip>
  ```

You can also deploy the same release package using the [Kudu service](https://github.com/projectkudu/kudu/wiki)
UI or REST API, see [Deploy ZIP or WAR](https://docs.microsoft.com/en-us/azure/app-service/deploy-zip)
for details.

## Trademark

**Trademarks** This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft trademarks or logos is subject to and must follow [Microsoft’s Trademark & Brand Guidelines](https://www.microsoft.com/legal/intellectualproperty/trademarks/usage/general). Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship. Any use of third-party trademarks or logos are subject to those third-party’s policies.

## License

[MIT](LICENSE.md)