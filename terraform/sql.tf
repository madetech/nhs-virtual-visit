resource "azurerm_sql_server" "sql" {
  name                         = "nhs-virtual-visits-${var.environment}"
  location                     = azurerm_resource_group.rg.location
  resource_group_name          = azurerm_resource_group.rg.name
  version                      = "12.0"
  administrator_login          = var.azure_sql_username
  administrator_login_password = var.azure_sql_password
}

resource "azurerm_mssql_database" "sql" {
  name        = "virtualvisits"
  server_id   = azurerm_sql_server.sql.id
  sku_name    = var.azure_sql_sku_name
  max_size_gb = var.azure_sql_max_size_gb

  long_term_retention_policy {
    weekly_retention  = var.azure_sql_weekly_retention
    monthly_retention = var.azure_sql_monthly_retention
    yearly_retention  = var.azure_sql_yearly_retention
    week_of_year      = var.azure_sql_week_of_year
  }

  short_term_retention_policy {
    retention_days = var.azure_sql_retention_days
  }
}


resource "azurerm_sql_firewall_rule" "azure_services" {
  name                = "AzureServices"
  resource_group_name = azurerm_resource_group.rg.name
  server_name         = azurerm_sql_server.sql.name
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "0.0.0.0"
}