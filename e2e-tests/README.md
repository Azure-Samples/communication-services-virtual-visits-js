# Automation tests for Azure Communication Services Virtual Visits

This is an automation tests folder for Virtual Visits sample, which contains all UI tests.

## Build and Run End to End tests locally

- Before running the tests make sure that the environment variable for connection string is set. [Learn more about environment variables and how to set them.](https://github.com/Azure-Samples/communication-services-virtual-visits-js#environment-variables)

- To install supported browsers, use the following command:

```
npx playwright install

```

- To build and run the tests, use the following commands:

```
npm run build
npm run test
```

- To check the test reports, use the following commands:

```
npx playwright show-report
```

## End to End tests in the pipeline

- Every change to a PR will trigger e2e tests workflow

- If the PR has any UI changes, adding a 'ui change' label is necessary to make sure that the tests are run against the updated UI screenshots

- Once the 'ui change' label is added, the update snapshot workflow will be triggerd and if any UI changes are found and if the snapshots has to be updated, the workflow will push a commit to your PR with the updated snapshots.

## Folder structure

If you are adding new tests for samples, please follow this folder structure:
.
├── tests # Tests for the sample folder
├── playwright.config.ts # playwright config file
├── package.json  
└── README.md
