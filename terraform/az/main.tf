provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name = "nhs-virtual-visit"
  location = "uksouth"
}