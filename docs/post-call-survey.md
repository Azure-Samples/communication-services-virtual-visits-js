# How to Configure Post-Call Survey

You can configure post-call surveys to collect valuable feedback like quality of services or net promoter score after a call ends.

## Use Microsoft Forms

Render your [Microsoft Form](https://www.microsoft.com/en-ca/microsoft-365/online-surveys-polls-quizzes) after a call ends:

### Configure using environment variables

```
VV_POSTCALL_SURVEY_TYPE = "msforms"
VV_POSTCALL_SURVEY_OPTIONS_SURVEYURL = "<your_MSForms_url>"
```

### Configure using defaultConfig.json

```
{
    ...
    "postCall": {
        "survey": {
            "type": "msforms",
            "options": {
                "surveyUrl": "<your_MSForms_url>"
            }
        }
    }
}
```

## Use a Custom Survey

Render a survey from your own survey provider:

### Configure using environment variables

```
VV_POSTCALL_SURVEY_TYPE = "custom"
VV_POSTCALL_SURVEY_OPTIONS_SURVEYURL = "<your_survey_url>"
```

### Configure using defaultConfig.json

```
{
    ...
    "postCall": {
        "survey": {
            "type": "custom",
            "options": {
                "surveyUrl": "<your_survey_url>"
            }
        }
    }
}
```

## Use the Default Post-Call Screen

The [Azure Communication Services UI Library](https://azure.github.io/communication-ui-library/) provides a default post-call screen that is rendered after a call ends, no configuration required.

To use the default post-call screen, remove `VV_POSTCALL_SURVEY_TYPE` from your environment variables and remove `postCall` from your config.
