resource "azurerm_app_service_plan" "app_service" {
  name                = "nhs-virtual-visits-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  kind                = "Linux"
  reserved            = true

  sku {
    tier = "Free"
    size = "F1"
  }
}

resource "azurerm_app_service" "app_service" {
  name                = "nhs-virtual-visits-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  app_service_plan_id = azurerm_app_service_plan.app_service.id
  
  app_settings = {
    "WEBSITE_NODE_DEFAULT_VERSION" = "12.20"
  }
}