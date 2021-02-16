variable "environment" {}

variable "location" {
  default = "UK South"
}

variable "image_name" {
  default = "nginx"
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