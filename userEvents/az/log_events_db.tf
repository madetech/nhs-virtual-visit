resource "azurerm_cosmosdb_account" "log_events_account" {
  name = "log-events-account"
  location = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  offer_type = "Standard"
  enable_free_tier = true
  kind = "GlobalDocumentDB"

  enable_automatic_failover = false
  
  capabilities {
    name = "EnableAggregationPipeline"
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

resource "azurerm_cosmosdb_sql_database" "log_events_db" {
  name                = "log_events_db"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.log_events_account.name
  throughput          = 400
}
