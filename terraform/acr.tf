data "azurerm_container_registry" "acr" {
  name                = "virtualvisits"
  resource_group_name = "nhs-virtual-visits-central"
}