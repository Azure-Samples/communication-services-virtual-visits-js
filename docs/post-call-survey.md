# How to Configure Post-Call Survey

You can configure post-call surveys to collect valuable feedback like quality of services or net promoter score after a call ends.

### Types of Post-Call survey

- [Create a 1-question poll](#onequestionpoll)
- [Use Microsoft Forms](#msforms)
- [Use a Custom Survey](#custom)

## <a id="onequestionpoll">Create a 1-question poll</a>

### Configure using environment variables

```
VV_POSTCALL_SURVEY_TYPE = "onequestionpoll"
VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_TITLE = "Tell us how we did"
VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_PROMPT = "How satisfied are you with this virtual appointment's audio and video quality?"
VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_TYPE = "likeOrDislike" or "rating" or "text"
VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_ANSWER_PLACEHOLDER = ""
VV_POSTCALL_SURVEY_ONEQUESTIONPOLL_SAVE_BUTTON_TEXT = "Continue"
VV_COSMOS_DB_CONNECTION_STRING = "Connection string of your Cosmos DB account"
VV_COSMOS_DB_NAME = "Name of the Cosmos Database"
```

### Configure using defaultConfig.json

```
{
    ...
    "postCall": {
        "survey": {
            "type": "onequestionpoll",
            "options": {
                "title": "Tell us how we did",
                "prompt": "How satisfied are you with this virtual appointment's audio and video quality?",
                "pollType": "likeOrDislike" or "rating" or "text",
                "answerPlaceholder": "",
                "saveButtonText": "Continue"
            }
        }
    },
    "cosmosDb": {
        "connectionString": "Connection string of your Cosmos DB account",
        "dbName": "Name of the Cosmos Database"
    }
}

```

### <a id="databaseConfiguration">Database configuration</a>

1-Question Poll results are stored in Cosmos DB. Use a connection string to connect to your Cosmos DB.
The data stored in the DB is as follows:

```
{
    callId: string,
    acsUserId: string,
    meetingLink: string,
    response: boolean | string | number //the response of the survey
}
```

Logs related to the call can be found in Azure Monitor logs
[Learn how to enable logging via Azure Monitor logs](https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/enable-logging)

The `callId` in the DB corresponds to CorrelationId in Azure Monitor logs

## <a id="msforms">Use Microsoft Forms</a>

Render your [Microsoft Form](https://www.microsoft.com/en-ca/microsoft-365/online-surveys-polls-quizzes) after a call ends:

### Configure using environment variables

```
VV_POSTCALL_SURVEY_TYPE = "msforms"
VV_POSTCALL_SURVEY_OPTIONS_SURVEYURL = "your MS Forms url"
```

### Configure using defaultConfig.json

```
{
    ...
    "postCall": {
        "survey": {
            "type": "msforms",
            "options": {
                "surveyUrl": "your MS Forms url"
            }
        }
    }
}
```

## <a id="custom">Use a Custom Survey</a>

Render a survey from your own survey provider:

### Configure using environment variables

```
VV_POSTCALL_SURVEY_TYPE = "custom"
VV_POSTCALL_SURVEY_OPTIONS_SURVEYURL = "your survey url"
```

### Configure using defaultConfig.json

```
{
    ...
    "postCall": {
        "survey": {
            "type": "custom",
            "options": {
                "surveyUrl": "your survey url"
            }
        }
    }
}
```

## Use the Default Post-Call Screen

The [Azure Communication Services UI Library](https://azure.github.io/communication-ui-library/) provides a default post-call screen that is rendered after a call ends, no configuration required.

To use the default post-call screen, remove `VV_POSTCALL_SURVEY_TYPE` from your environment variables and remove `postCall` from your config.
