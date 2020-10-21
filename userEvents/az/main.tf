# Configure the Azure Provider
provider "azurerm" {
  # whilst the `version` attribute is optional, we recommend pinning to a given version of the Provider
  version = "=2.20.0"
  features {}
}

# Create a resource group
resource "azurerm_resource_group" "rg" {
  name     = "nhs_virtual_visit_terraform"
  location = "UK South"
}

resource "azurerm_cosmosdb_account" "visit_events_db" {
  name = "visit-events"
  location = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  offer_type = "Standard"
  enable_free_tier = true
  kind = "GlobalDocumentDB"

  enable_automatic_failover = false
  
  capabilities {
    name = "EnableAggregationPipeline"
  }

  capabilities {
    name = "mongoEnableDocLevelTTL"
  }

  capabilities {
    name = "MongoDBv3.4"
  }

  consistency_policy {
    consistency_level = "BoundedStaleness"
    max_interval_in_seconds = 10
    max_staleness_prefix = 200
  }
  
  geo_location {
    location = azurerm_resource_group.rg.location
    failover_priority = 0
  }
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

resource "azurerm_storage_account" "event_logger_storage" {
  name                     = "eventloggerstorage"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_function_app" "log_events" {
  name = "log-events"
  location = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type = "linux"
  https_only = true
  
  app_service_plan_id        = azurerm_app_service_plan.event_logger_service_plan.id
  storage_account_name       = azurerm_storage_account.event_logger_storage.name
  storage_account_access_key = azurerm_storage_account.event_logger_storage.primary_access_key
}
