# 8. Deploying to Azure

The app has been designed to easily deploy a [Microsoft Azure App Service](https://azure.microsoft.com/en-gb/services/app-service/) on [Microsoft Azure](azure.microsoft.com) using [Terraform](https://www.terraform.io/).

## Pipelines

All deployment is handled by terraform in the build-and-deploy pipeline found in [build-and-deploy.yml](../../.github/workflows/build-and-deploy.yml)

## Setting Secrets on Github

To set up secrets on GitHub refer to [Github Documentation - Creating Secrets for a Repository](https://docs.github.com/en/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository)

The following are required to be set as GitHub secrets in the GitHub repository:

```
TF_API_Token
```

The above is your Terraform API token. See [Setting Up Terraform](./07-setting-up-terraform.md)

```
AZURE_CREDENTIALS
```

The above is your Azure credentials value in json format:

```
{
    "clientId": "<GUID>",
    "clientSecret": "<GUID>",
    "subscriptionId": "<GUID>",
    "tenantId": "<GUID>",
    (...)
  }
```

```
ACR_PASSWORD
```

The above is your Azure Container Registry password.




