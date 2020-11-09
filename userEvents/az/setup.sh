#!/bin/bash
function random_suffix() {
  head -c 5 /dev/urandom | base32 | awk '{print tolower($0)}'
}

function generate_azure_terraform_state_storage_account_name() {
  local suffix="$1"
  echo "tfstate$(random_suffix)"
}

function find_azure_terraform_state_storage_account() {
  az storage account list --output "tsv" 2>/dev/null | grep -Po "tfstate([a-z0-9]+)" | head -1
}

function find_azure_terraform_state_blob() {
  local account_key="$1"
  local prefix="$2"
  local storage_account_name="$3"
  local container_name="$4"
  
  az storage blob list --account-name "$storage_account_name" --container-name "$container_name" --account-key "$account_key" -o "tsv" 2>/dev/null |
  grep -Po "${prefix}tfstate" |
  head -1
}

function get_account_key() {
  local resource_group_name="$1"
  local storage_account_name="$2"
  
  az storage account keys list --resource-group "$resource_group_name" --account-name "$storage_account_name" --query "[0].value" -o "tsv" 2>/dev/null
}

prefix="vv"

resource_group_name="tfstate"
container_name="tfstate"
storage_account_name="$(find_azure_terraform_state_storage_account)"
account_key="$(get_account_key "$resource_group_name" "$storage_account_name")"
blob_name="$(find_azure_terraform_state_blob "$account_key" "$prefix" "$storage_account_name" "tfstate")"

#create the storage account if it's missing
if [ -z "$storage_account_name" ]
then
  echo "No storage account for Terraform found, creating..."
  storage_account_name="$(generate_azure_terraform_state_storage_account_name)"
  
  if [ -z "$(az group list --output "tsv" | grep "tfstate")" ]
  then
    echo "Creating resource group"
    # Create resource group
    az group create --name "$resource_group_name" --location "uksouth"
  fi

  if [ -z "$(az group list --output "tsv" | grep -P "tfstate([a-z0-9]+)")" ]
  then
    echo "Creating storage account"
    # Create storage account
    az storage account create --resource-group "$resource_group_name" --name "$storage_account_name" --sku "Standard_LRS" --encryption-services "blob"
  fi
  
  account_key="$(get_account_key "$resource_group_name" "$storage_account_name")"
  
  echo "Creating storage container"
  az storage container create --name $container_name --account-name $storage_account_name --account-key $account_key
fi

# Initialize terraform if the state is missing
if [ -z "$blob_name" ] 
then
  echo "No Terraform state found, initializing"
  blob_name="${prefix}tfstate"
  terraform init -backend-config=resource_group_name="$resource_group_name" -backend-config=storage_account_name="$storage_account_name" -backend-config=container_name="$container_name" -backend-config=key="$blob_name"
  terraform apply
else
  echo "Existing terraform state found, applying any changes"

  terraform init -backend-config=resource_group_name="$resource_group_name" -backend-config=storage_account_name="$storage_account_name" -backend-config=container_name="$container_name" -backend-config=key="$blob_name"
  terraform apply
fi
