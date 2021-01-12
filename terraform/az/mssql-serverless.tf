
resource "azurerm_storage_account" "sa" {
    name                     = "nhsvvmssqlaudit"
    resource_group_name      = azurerm_resource_group.rg.name
    location                 = azurerm_resource_group.rg.location
    account_tier             = "Standard"
    account_replication_type = "LRS"

    tags = {
        environment = "Production"
        name = "nhs-vv"
    }
}

resource "azurerm_mssql_server" "mssql_server" {
    name                         = "nhs-virtual-visit"
    resource_group_name          = azurerm_resource_group.rg.name
    location                     = azurerm_resource_group.rg.location
    version                      = "12.0"
    administrator_login          = "<PLACEHOLDER>"
    administrator_login_password = "<PLACEHOLDER>"

    tags = {
        environment = "Production"
        name = "nhs-vv"
    }
}

resource "azurerm_mssql_database" "mssql_db" {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> test: subject: Create terraform scripts
    name                            = "nhs-virtual-visit"
    server_id                       = azurerm_mssql_server.mssql_server.id
    collation                       = "SQL_Latin1_General_CP1_CI_AS"
    license_type                    = "LicenseIncluded"
    max_size_gb                     = 20
    min_capacity                    = 1
    auto_pause_delay_in_minutes     = 60
    sku_name                        = "GP_S_Gen5_1"
    zone_redundant                  = false
<<<<<<< HEAD
=======
    name           = "nhs-virtual-visit"
    server_id      = azurerm_mssql_server.mssql_server.id
    collation      = "SQL_Latin1_General_CP1_CI_AS"
    license_type   = "LicenseIncluded"
    max_size_gb    = 20
    read_scale     = true
    sku_name       = "GP_S_Gen5_1"
    zone_redundant = false
>>>>>>> test: subject: Create terraform scripts
=======
>>>>>>> test: subject: Create terraform scripts

    tags = {
        environment = "Production"
        name = "nhs-vv"
    }
}

resource "azurerm_mssql_server_extended_auditing_policy" "mssql-ap" {
    server_id                               = azurerm_mssql_server.mssql_server.id
    storage_endpoint                        = azurerm_storage_account.sa.primary_blob_endpoint
    storage_account_access_key              = azurerm_storage_account.sa.primary_access_key
    storage_account_access_key_is_secondary = false
    retention_in_days                       = 6
}