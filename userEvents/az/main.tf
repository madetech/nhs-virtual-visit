variable "log_event_code_zip" {
    type = "string"
    default = "../build/log_event_code.zip"
}

provider "azurerm" {
  version = "=2.20.0"
  features {}
}

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

data "azurerm_storage_account_sas" "sas" {
  connection_string = "${azurerm_storage_account.event_logger_storage.primary_connection_string}"
  https_only = true
  start = "2020-10-01"
  expiry = "2021-12-31"

  resource_types {
    object = true
    container = false
    service = false
  }
  services {
    blob = true
    queue = false
    table = false
    file = false
  }
  permissions {
    read = true
    write = true
    delete = false
    list = false
    add = false
    create = false
    update = false
    process = false
  }
}

resource "azurerm_storage_container" "event_logger_storage_container" {
    name = "function-releases"
    storage_account_name = "${azurerm_storage_account.event_logger_storage.name}"
    container_access_type = "private"
}

resource "azurerm_storage_blob" "log_events_code" {
    name = "log_events.zip"
    storage_account_name = "${azurerm_storage_account.event_logger_storage.name}"
    storage_container_name = "${azurerm_storage_container.event_logger_storage_container.name}"
    type = "block"
    source = "${var.log_event_code_zip}"
}

resource "azurerm_function_app" "log_events" {
  name = "log-events"
  location = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type = "linux"
  
  app_service_plan_id        = azurerm_app_service_plan.event_logger_service_plan.id
  storage_account_name       = azurerm_storage_account.event_logger_storage.name
  storage_account_access_key = azurerm_storage_account.event_logger_storage.primary_access_key
  
  app_settings = {
    https_only = true
    FUNCTIONS_WORKER_RUNTIME = "node"
    WEBSITE_NODE_DEFAULT_VERSION = "~12"
    FUNCTION_APP_EDIT_MODE = "readwrite"
    HASH = "${base64encode(filesha256("${var.log_event_code_zip}"))}"
    WEBSITE_RUN_FROM_PACKAGE = "https://${azurerm_storage_account.event_logger_storage.name}.blob.core.windows.net/${azurerm_storage_container.event_logger_storage_container.name}/${azurerm_storage_blob.log_events_code.name}${data.azurerm_storage_account_sas.sas.sas}"
  }
}
