# Automation tests for Azure Communication Services Virtual Appointments

This is an automation tests folder for Virtual Appointments sample, which contains all UI tests.

## Build and Run End to End tests locally

- Before running the tests make sure that the environment variables VV_COMMUNICATION_SERVICES_CONNECTION_STRING, VV_COSMOS_DB_CONNECTION_STRING and VV_COSMOS_DB_NAME are set. [Learn more about environment variables and how to set them.](https://github.com/Azure-Samples/communication-services-virtual-visits-js#environment-variables)

- To install dependencies, use the following command:

```
npm install
npx playwright install
```

For more information about browsers, check the [Official Playwright Documentation for Browsers](https://playwright.dev/docs/browsers)

- To build the tests, use the following commands:

```
npm run build
```

- Run the following command before running the tests for the first time to get the local copy of the snapshots.

```
npm run update-snapshots
```

For more information about playwright snapshot testing, see the official [Playwright Documentation](https://playwright.dev/docs/test-snapshots).

- To run the tests, use the following command:

```
npm run test
```

- To check the test reports, use the following commands:

```
npx playwright show-report
```

- If you have any UI changes and want to update the snapshots, use the following commands:

```
npm run update-snapshots
```

## End to End tests in the pipeline

- Every change to a PR will trigger e2e tests workflow

- If the PR has any UI changes, adding a 'ui change' label is necessary to make sure that the tests are run against the updated UI screenshots

- Once the 'ui change' label is added, the update snapshot workflow will be triggerd. If any UI changes are found and if the snapshots has to be updated, the workflow will push a commit to your PR with the updated snapshots.

## Folder structure

If you are adding new tests for samples, please follow this folder structure:

    .
    ├── tests                                  # End to end tests
    ├── common                                 # utils and common code for testing
    ├── playwright.config.ts                   # playwright config file
    ├── package.json
    └── README.md
