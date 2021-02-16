resource "azurerm_sql_server" "sql" {
  name = "nhs-virtual-visits-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  version = "12.0"
  administrator_login = var.azure_sql_username
  administrator_login_password = var.azure_sql_password
}

resource "azurerm_sql_database" "sql" {
  name                = "virtualvisits"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  server_name         = azurerm_sql_server.sql.name
  edition = "Basic"
}