# 7. Setting up Terraform

To build, manage and deploy infrastructure to Azure, we use [Terraform Cloud](https://www.terraform.io/).

## Creating a Terraform organisation 

You need to create a terraform organisation before you can set the required Terraform variables and environment variables on your Terraform app.

1. [Create a Terraform organisation](https://app.terraform.io/signup/account) (if your trust
   doesn't have one already)

## Create a Workspace for the App

1. If you are in the development stage create a workspace `nhs-virtual-visit-dev` 
1. If you are in production stage create a workspace `nhs-virtual-visit-production`

See [Creating Workspaces](https://www.terraform.io/docs/cloud/workspaces/creating.html) on how to create a workspace.

### Adding the Terraform variables

The following variables are required in your terraform app.

```
environment
```

If you are in your development workspace set the variable `environment` to `dev`
If you are in your production workspace the variable `environment` to `production`

```
app_service_sku_tier
app_service_sku_size
```

The above is your Azure App service plan tier and size

```
image_name
```

The above is your docker image name on the Azure Container registry

```
azure_sql_username
azure_sql_password
```

The above is the username and password for your Azure SQL database

```
sms_join_template_id
sms_initial_template_id
email_initial_template_id
email_join_template_id
sms_updated_visit_template_id
email_updated_visit_template_id
email_reset_password_template_id
email_sign_up_template_id
email_sign_up_request_template_id
```

The above are the email and sms templates used in GovNotify.
See [GovNotify Templates](./06-govuk-notify-templates.md)

```
gov_notify_api_key
```

The above is your GovNotify API key

```
jwt_signing_key
```

The above is your JWT secrets

```
datadog_api_key
```

The above is your DataDog API key. See [Setting Up DataDog](./03-setting-up-datadog.md)

```
whereby_api_key
whereby_subdomain
```

The above is your whereby details. See [Setting Up Whereby](./06-setting-up-whereby.md)

```
sentry_dsn
sentry_org
sentry_project
sentry_auth_token
```

The above are your Sentry details. See [Setting up Sentry](./05-setting-up-sentry.md)

```
valid_email_domains
```

The above is the email domains that are allowed to sign up for the app. Multiple domains can be used and this should be separated by a comma.

For each one of these, you'll need to add them to each Terraform app. To add a variable to a Terraform app, 
see their documentation on [variables](https://www.terraform.io/docs/cloud/workspaces/variables.html).

It is recommended that the values below be marked as sensitive in your Terraform App.

```
azure_sql_password
gov_notify_api_key
jwt_signing_key
whereby_api_key
datadog_api_key
sentry_auth_token
```

### Adding the Terraform environment variables

The following environment variables are required in your Terraform App:

```
ARM_CLIENT_ID
ARM_CLIENT_SECRET
ARM_TENANT_ID
```

You will have to create a [Azure AD Service Principal](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal)
to have access to these values.

## Creating a Workspace for the Azure Container Registry

A workspace named `virtual-visit-central` is required for the Azure Container Registry to build, store and manage the app's container image.

See [Creating Workspaces](https://www.terraform.io/docs/cloud/workspaces/creating.html) on how to create a workspace.

### Adding the Terraform environment variables

The following environment variables are required in your `virtual-visit-central` workspace:

```
ARM_CLIENT_ID
ARM_CLIENT_SECRET
ARM_TENANT_ID
```

You will have to create a [Azure AD Service Principal](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal)
to have access to these values.

### Replacing the Subscription ID

The Azure Container Registry is created in the folder [terraform/central](../../terraform/central/). Replace the value of subscription_id with your subscription id in the file [main.tf](../../terraform/central/main.tf).

```
provider "azurerm" {
  features {}

  subscription_id = "your_subscription_id here"
}
```