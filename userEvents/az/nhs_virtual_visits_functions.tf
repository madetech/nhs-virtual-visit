locals {
  functions_dir = "build"
  nhs_virtual_visits_filename = "nhs_virtual_visits_functions"
  log_event_code_zip = "${local.functions_dir}/${local.nhs_virtual_visits_filename}.zip"
  hashed_log_event_code_zip = "${local.functions_dir}/${local.nhs_virtual_visits_filename}_${base64encode(filesha256(local.log_event_code_zip))}.zip"
}

resource "azurerm_storage_account" "function_storage" {
  name                     = "eventloggerstorage"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

data "azurerm_storage_account_sas" "sas" {
  connection_string = azurerm_storage_account.function_storage.primary_connection_string
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

resource "azurerm_storage_container" "function_storage_container" {
    name = "function-releases"
    storage_account_name = azurerm_storage_account.function_storage.name
    container_access_type = "private"
}

resource "azurerm_storage_blob" "nhs_virtual_visits_code" {
    # We use a name composed of the filename and a hash of the file to ensure the blob is recreated when changed
    name = local.hashed_log_event_code_zip
    storage_account_name = azurerm_storage_account.function_storage.name
    storage_container_name = azurerm_storage_container.function_storage_container.name
    type = "Block"
    source = local.log_event_code_zip
}

# https://github.com/terraform-providers/terraform-provider-azurerm/issues/1966
resource "azurerm_function_app" "nhs_virtual_visits_functions" {
  name = "nhs-virtual-visits-functions"
  location = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  app_service_plan_id = azurerm_app_service_plan.event_logger_service_plan.id
  storage_account_name = azurerm_storage_account.function_storage.name
  storage_account_access_key = azurerm_storage_account.function_storage.primary_access_key
  version = "~3"
  
  site_config {
    always_on = false
  }
  
  app_settings = {
    APPINSIGHTS_INSTRUMENTATIONKEY = "09f03373-f246-4d9a-b6ab-745b2034b993"
    APPLICATIONINSIGHTS_CONNECTION_STRING = "InstrumentationKey=09f03373-f246-4d9a-b6ab-745b2034b993;IngestionEndpoint=https://uksouth-0.in.applicationinsights.azure.com/"
    FUNCTIONS_EXTENSION_VERSION = "~3"
    https_only = true
    
    LOG_EVENTS_DB_ACCOUNT_ENDPOINT = azurerm_cosmosdb_account.log_events_account.endpoint
    LOG_EVENTS_DB_ACCOUNT_KEY = azurerm_cosmosdb_account.log_events_account.primary_master_key
    LOG_EVENTS_DB_ID = azurerm_cosmosdb_sql_database.log_events_db.name
    
    FUNCTIONS_WORKER_RUNTIME = "node"
    WEBSITE_NODE_DEFAULT_VERSION = "~12"
    FUNCTION_APP_EDIT_MODE = "readwrite"
    HASH = base64encode(filesha256(local.log_event_code_zip))
    WEBSITE_RUN_FROM_PACKAGE = "https://${azurerm_storage_account.function_storage.name}.blob.core.windows.net/${azurerm_storage_container.function_storage_container.name}/${azurerm_storage_blob.nhs_virtual_visits_code.name}${data.azurerm_storage_account_sas.sas.sas}"
  }
}
