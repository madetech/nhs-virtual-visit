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
  https_only          = true

  site_config {
    linux_fx_version = "DOCKER|${var.image_name}:${var.image_version}"
  }

  app_settings = {
    "DOCKER_REGISTRY_SERVER_USERNAME"   = data.azurerm_container_registry.acr.admin_username
    "DOCKER_REGISTRY_SERVER_PASSWORD"   = data.azurerm_container_registry.acr.admin_password
    "DOCKER_REGISTRY_SERVER_URL"        = "https://virtualvisits.azurecr.io"
    "NODE_ENV"                          = "production"
    "ENV"                               = var.environment
    "DATADOG_API_KEY"                   = var.datadog_api_key
    "MSQL_DB_SERVER"                    = azurerm_sql_server.sql.fully_qualified_domain_name
    "MSQL_DB_USER"                      = var.azure_sql_username
    "MSQL_DB_PASSWORD"                  = var.azure_sql_password
    "MSQL_DB_DRIVER"                    = "mssql"
    "MSQL_DB_PORT"                      = 1433
    "MSQL_DB_POOL_MAX"                  = 15
    "MSQL_DB_POOL_MIN"                  = 5
    "MSQL_DB_POOL_IDLE_TIMEOUT"         = 30000
    "MSQL_DB_NAME"                      = "virtualvisits"
    "ORIGIN"                            = "https://nhs-virtual-visits-${var.environment}.azurewebsites.net"
    "GOVNOTIFY_API_KEY"                 = var.gov_notify_api_key
    "SMS_INITIAL_TEMPLATE_ID"           = var.sms_initial_template_id
    "SMS_JOIN_TEMPLATE_ID"              = var.sms_join_template_id
    "EMAIL_INITIAL_TEMPLATE_ID"         = var.email_initial_template_id
    "EMAIL_JOIN_TEMPLATE_ID"            = var.email_join_template_id
    "SMS_UPDATED_VISIT_TEMPLATE_ID"     = var.sms_updated_visit_template_id
    "EMAIL_UPDATED_VISIT_TEMPLATE_ID"   = var.email_updated_visit_template_id
    "EMAIL_RESET_PASSWORD_TEMPLATE_ID"  = var.email_reset_password_template_id
    "EMAIL_SIGN_UP_TEMPLATE_ID"         = var.email_sign_up_template_id
    "EMAIL_SIGN_UP_REQUEST_TEMPLATE_ID" = var.email_sign_up_request_template_id
    "JWT_SIGNING_KEY"                   = var.jwt_signing_key
    "ENABLE_WHEREBY"                    = "yes"
    "WHEREBY_API_KEY"                   = var.whereby_api_key
    "WHEREBY_SUBDOMAIN"                 = var.whereby_subdomain
    "SENTRY_DSN"                        = var.sentry_dsn
    "SENTRY_ORG"                        = var.sentry_org
    "SENTRY_PROJECT"                    = var.sentry_project
    "SENTRY_AUTH_TOKEN"                 = var.sentry_auth_token
    "ENABLE_SENTRY"                     = "no"
    "SIGN_UP_EMAIL_DOMAINS"             = var.valid_email_domains
  }
}

output "app_service_id" {
  value = azurerm_app_service.app_service.id
}