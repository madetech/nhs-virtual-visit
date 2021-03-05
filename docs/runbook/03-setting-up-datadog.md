# 3. Setting up Datadog

To log and monitor errors, we use [DataDog](https://www.datadoghq.com/). This makes it easier to diagnose bugs found in the application.

## Creating a DataDog organisation and API Key

The application is already set up to log to DataDog using their SDK, see [logger.js](../../logger.js).
As a result, the only thing that needs to be done is setting the required DataDog API key in
the variables on your Terraform App.

1. [Create a DataDog organisation](https://app.datadoghq.com/signup) (if your trust
   doesn't have one already)
1. Within the **Integrations** section of your organistation, click on **APIs**
1. Choose **API Keys** and Create a new API Key
1. This API key is to be added to the Terraform App as a variable 'datadog_api_key' declared in [variables.tf](../../terraform/variables.tf)

## Adding the DataDog API key in Terraform App

The following variable is needed to be added to your organisation's Terraform App:

```
datadog_api_key
```

To add a variable to a Terraform app. In your Terraform App:
1. Click on the workspace name for your project
1. Choose **Variables** and Create a new API Key
1. Click on the **Add variable** button
1. Enter ***Key*** as 

```
datadog_api_key
``` 
1. Enter ***Value*** as your API key that you have created in 'Creating a DataDog Organisation and API Key' section.
1. Click ***Save variable*** button

Note: The `datadog_api_key` is referred to in the section [Setting Up Terraform ](./07-setting-up-terraform.md)