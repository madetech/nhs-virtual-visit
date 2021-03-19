terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
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

  subscription_id = var.subscription_id
}

resource "azurerm_resource_group" "rg" {
  location = var.location
  name     = "nhs-virtual-visits-${var.environment}"
}