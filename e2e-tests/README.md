# Automation tests for Azure Communication Services Virtual Visits

This is an automation tests folder for Virtual Visits sample, which contains all UI tests.

## Build and Run End to End tests

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

## Folder structure

If you are adding new tests for samples, please follow this folder structure:
.
├── tests # Tests for the sample folder
├── playwright.config.ts # playwright config file
├── package.json  
└── README.md
