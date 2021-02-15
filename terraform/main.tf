terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "2.47.0"
    }
  }

  backend "remote" {
    organization = "nhs-virtual-visit"

    workspaces {
      prefix = "nhs-virtual-visit-"
    }
  }
}

provider "azurerm" {
  features {}

  subscription_id = "9d247a76-6114-4d06-8bd2-2be4bd6a0cdc"
}

resource "azurerm_resource_group" "rg" {
  location = var.location
  name = "nhs-virtual-visit-${var.environment}"
}