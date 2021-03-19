# 7. Setting up Terraform

To build, manage and deploy infrastructure to Azure, we use [Terraform Cloud](https://www.terraform.io/).

It is possible that you have already existing Terraform projects and have a build process for them. In that case, there's nothing special about the Terraform, though the backend may require extra configuration.

These instructions assume you have an already existing Azure account and subscription created. If this is not the case, you may need to go through that setup or liase with your ops team to get that.

## Creating a Terraform organisation 

You need to create a terraform organisation before you can set the required Terraform variables and environment variables on your Terraform app.

1. [Create a Terraform organisation](https://app.terraform.io/signup/account) (if you
   don't have one already)

## Create a Workspace for the App

You will need to create a Workspace in Terraform Cloud to store configuration and state.

The backend configuration expects this to be named like "nhs-virtual-visit-dev" but this is just nomenclature.

See [Creating Workspaces](https://www.terraform.io/docs/cloud/workspaces/creating.html) on how to create a workspace.

### Terraform Variables

The following are all variables that currently exist for the service.

Which ones you will need to set will depend on your requirements.

At minimum, you will need to set variables which do not have a default set.

**Variable Name**|**Default**|**Notes**
:-----:|:-----:|:-----:
environment|dev|This can be used to run multiple environments in the same subscription and is arbritary.
location|UK South|It is unlikely this will need to get changed, but the app can be hosted elsewhere.
subscription\_id| |Azure Subscription ID, if you don't know this, ask your ops team
image\_name|virtualvisits.azurecr.io/virtualvisits|This shouldn't need to be changed from default, where the docker image is stored
image\_version|latest|This is set by CI/CD for dev, but will likely want to be pinned in production.
app\_service\_sku\_tier|Basic|Tier of App Service
app\_service\_sku\_size|B0|Size of App Service
azure\_sql\_username|virtualvisits|Username of Azure SQL admin user
azure\_sql\_password| |This should be a strong password to secure the database
gov\_notify\_api\_key| |Gov Notify API Key created in Step 2
sms\_initial\_template\_id| |Created in Step 2
sms\_join\_template\_id| |Created in Step 2
sms\_updated\_visit\_template\_id| |Created in Step 2
email\_initial\_template\_id| |Created in Step 2
email\_join\_template\_id| |Created in Step 2
email\_updated\_visit\_template\_id| |Created in Step 2
email\_reset\_password\_template\_id| |Created in Step 2
email\_sign\_up\_template\_id| |Created in Step 2
email\_sign\_up\_request\_template\_id| |Created in Step 2
jwt\_signing\_key| |A secure string used to sign JWTs
whereby\_api\_key| |WhereBy API key created in Step 6
whereby\_subdomain| |WhereBy Subdomain created in Step 6
datadog\_api\_key| |DataDog API key created in Step 3, only if using DataDog
valid\_email\_domains|nhs.uk,nhs.net|A comma separated list of allowed email domains
azure\_sql\_weekly\_retention|P4W|How long to retain weekly backups, specified in ISO 8601 format
azure\_sql\_monthly\_retention|P12M|How long to retain monthly backups, specified in ISO 8601 format
azure\_sql\_yearly\_retention|P5Y|How long to retain yearly backups, specified in ISO 8601 format
azure\_sql\_week\_of\_year|13|Which week of the year are yearly backups taken
azure\_sql\_retention\_days|7|How many days short-term backups are retained for
azure\_sql\_sku\_name|Basic|Tier of Azure SQL database
azure\_sql\_max\_size\_gb|2|Maximum size of the database

### Terraform environment variables

For Terraform to deploy to Azure, extra environment variables will need to be set, these are:

- `ARM_CLIENT_ID`
- `ARM_CLIENT_SECRET`
- `ARM_TENANT_ID`

These will be from the Service Principal that Terraform will use to authenticate with Azure.

If you do not already have this, you will need to ask the administrator of your Azure Active Directory organisation to create a Service Principal with the necessary permissions to create and manage resources within a subscription.
