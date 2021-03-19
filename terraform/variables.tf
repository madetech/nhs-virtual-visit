variable "environment" {}

variable "location" {
  default = "UK South"
}

variable "subscription_id" {
  default = "9d247a76-6114-4d06-8bd2-2be4bd6a0cdc"
}

variable "image_name" {
  default = "virtualvisits.azurecr.io/virtualvisits"
}

variable "image_version" {
  default = "latest"
}

variable "app_service_sku_tier" {}
variable "app_service_sku_size" {}

variable "azure_sql_username" {
  default = "virtualvisits"
}

variable "azure_sql_password" {
  default = "P@ssw0rd"
}

variable "gov_notify_api_key" {}
variable "sms_initial_template_id" {
  default = "3b45757d-4128-4e33-ac7c-00674a70888d"
}
variable "sms_join_template_id" {
  default = "f7f5cada-213d-45ca-8910-0b5f596dcdb1"
}
variable "sms_updated_visit_template_id" {
  default = "bc188446-8055-4fb1-9cc0-6bdac1979c36"
}
variable "email_initial_template_id" {
  default = "9f5fac38-9b28-45f3-8725-7ee9f27f79ee"
}
variable "email_join_template_id" {
  default = "842e0b6d-80de-4acf-9746-1d281e8a6480"
}
variable "email_updated_visit_template_id" {
  default = "9a74fac7-6c85-40d6-8b5b-e526a4b08129"
}
variable "email_reset_password_template_id" {
  default = ""
}
variable "email_sign_up_template_id" {
  default = ""
}
variable "email_sign_up_request_template_id" {
  default = ""
}
variable "jwt_signing_key" {}
variable "whereby_api_key" {}
variable "whereby_subdomain" {
  default = "nhs-virtual-visit"
}
variable "sentry_dsn" {
  default = ""
}
variable "sentry_org" {
  default = ""
}
variable "sentry_project" {
  default = ""
}
variable "sentry_auth_token" {
  default = ""
}

variable "datadog_api_key" {}

variable "valid_email_domains" {
  default = "nhs.uk,nhs.net"
}

variable "azure_sql_weekly_retention" {
  default = "P4W"
}

variable "azure_sql_monthly_retention" {
  default = "P12M"
}

variable "azure_sql_yearly_retention" {
  default = "P5Y"
}

variable "azure_sql_week_of_year" {
  default = "13"
}

variable "azure_sql_retention_days" {
  default = 7
}

variable "azure_sql_sku_name" {
  default = "Basic"
}

variable "azure_sql_max_size_gb" {
  default = 2
}
