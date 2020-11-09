terraform {
  backend "azurerm" {
  }
}

provider "azurerm" {
  version = "=2.20.0"
  features {}
}

resource "azurerm_resource_group" "rg" {
  name = "nhs_virtual_visit_terraform"
  location = "UK South"
}

resource "azurerm_app_service_plan" "event_logger_service_plan" {
  name = "azure-functions-test-service-plan"
  location = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  kind = "FunctionApp"
  
  sku {
    tier = "Standard"
    size = "S1"
  }
}
