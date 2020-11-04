#!/bin/bash
function random_suffix() {
  head -c 5 /dev/urandom | base32 | awk '{print tolower($0)}'
}

function find_azure_terraform_state() {
  az group list --output tsv | grep -Po "${PREFIX}tfstate([a-z0-9]+)" | head -1 | sed "s/^${PREFIX}tfstate//"
}

PREFIX="vv"
SUFFIX="$(find_azure_terraform_state)"

if [ -z "$SUFFIX" ]
then
  echo "This script will:"
  echo " - Create the resources needed to store terraform's state on your Azure account"
  echo " - Initialize NHS Virtual Visits on your Azure account"
  echo " - Procure and setup the infrastructure for NHS Virtual Visits"
  echo "Press enter to continue"
  read
  echo "No terraform state found in Azure, creating..."
  SUFFIX="$(random_suffix)"
  
  RESOURCE_GROUP_NAME="${PREFIX}tfstate${SUFFIX}"
  STORAGE_ACCOUNT_NAME="${PREFIX}tfstate${SUFFIX}"
  CONTAINER_NAME="${PREFIX}tfstate${SUFFIX}"

  export TF_DATA_DIR=".${PREFIX}terraform${SUFFIX}"

  # Create resource group
  az group create --name $RESOURCE_GROUP_NAME --location uksouth

  # Create storage account
  az storage account create --resource-group $RESOURCE_GROUP_NAME --name $STORAGE_ACCOUNT_NAME --sku Standard_LRS --encryption-services blob
    
  # Get storage account key
  ACCOUNT_KEY=$(az storage account keys list --resource-group $RESOURCE_GROUP_NAME --account-name $STORAGE_ACCOUNT_NAME --query "[0].value" -o tsv)

  echo account key $ACCOUNT_KEY
  # Create blob container
  az storage container create --name $CONTAINER_NAME --account-name $STORAGE_ACCOUNT_NAME --account-key $ACCOUNT_KEY

  terraform init -backend-config=resource_group_name=$RESOURCE_GROUP_NAME -backend-config=storage_account_name=$STORAGE_ACCOUNT_NAME -backend-config=container_name=$CONTAINER_NAME -backend-config=key=terraform.tfstate
  terraform apply
else
  RESOURCE_GROUP_NAME="${PREFIX}tfstate${SUFFIX}"
  STORAGE_ACCOUNT_NAME="${PREFIX}tfstate${SUFFIX}"
  CONTAINER_NAME="${PREFIX}tfstate${SUFFIX}"

  export TF_DATA_DIR=".${PREFIX}terraform${SUFFIX}"
  echo $TF_DATA_DIR

  echo "Existing terraform state found, applying any changes"
  terraform apply
fi
