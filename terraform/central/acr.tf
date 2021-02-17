resource "azurerm_container_registry" "acr" {
  name                = "virtualvisits"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = true
}