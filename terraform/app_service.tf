resource "azurerm_app_service_plan" "app_service" {
  name                = "nhs-virtual-visits-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  kind                = "Linux"
  reserved            = true

  sku {
    tier = var.app_service_sku_tier
    size = var.app_service_sku_size
  }
}

resource "azurerm_app_service" "app_service" {
  name                = "nhs-virtual-visits-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  app_service_plan_id = azurerm_app_service_plan.app_service.id

  site_config {
    linux_fx_version = "DOCKER|${var.image_name}:${var.image_version}"
  }

  app_settings = {
    "MSQL_DB_SERVER"   = azurerm_sql_server.sql.fully_qualified_domain_name
    "MSQL_DB_USER"     = var.azure_sql_username
    "MSQL_DB_PASSWORD" = var.azure_sql_password
  }
}