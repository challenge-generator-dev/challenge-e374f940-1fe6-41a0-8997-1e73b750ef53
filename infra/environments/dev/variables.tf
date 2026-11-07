variable "aws_region" {
  description = "Región de AWS para el entorno de desarrollo."
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Nombre del entorno (dev)."
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Nombre del proyecto para etiquetar recursos en desarrollo."
  type        = string
  default     = "order-management"
}

variable "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB para órdenes en desarrollo."
  type        = string
  default     = "orders-dev"
}

variable "billing_mode" {
  description = "Modo de facturación para la tabla DynamoDB en desarrollo."
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "enable_ttl" {
  description = "Indica si se debe habilitar TTL en la tabla DynamoDB de desarrollo."
  type        = bool
  default     = false
}

variable "enable_stream" {
  description = "Indica si se debe habilitar el stream de DynamoDB en desarrollo."
  type        = bool
  default     = true
}

variable "stream_view_type" {
  description = "Tipo de vista del stream para DynamoDB en desarrollo."
  type        = string
  default     = "NEW_AND_OLD_IMAGES"
}

variable "global_secondary_indexes" {
  description = "Índices secundarios globales para la tabla DynamoDB en desarrollo."
  type = list(object({
    name            = string
    hash_key        = string
    range_key       = string
    projection_type = string
    read_capacity   = number
    write_capacity  = number
    non_key_attributes = list(string)
  }))
  default = [
    {
      name            = "client-index"
      hash_key        = "client_id"
      range_key       = "order_date"
      projection_type = "INCLUDE"
      read_capacity   = 5
      write_capacity  = 5
      non_key_attributes = ["status", "total_amount"]
    },
    {
      name            = "status-index"
      hash_key        = "status"
      range_key       = "order_date"
      projection_type = "KEYS_ONLY"
      read_capacity   = 5
      write_capacity  = 5
      non_key_attributes = []
    }
  ]
}

variable "attributes" {
  description = "Atributos para la tabla DynamoDB en desarrollo."
  type = list(object({
    name = string
    type = string
  }))
  default = [
    {
      name = "id"
      type = "S"
    },
    {
      name = "client_id"
      type = "S"
    },
    {
      name = "order_date"
      type = "S"
    },
    {
      name = "status"
      type = "S"
    },
    {
      name = "total_amount"
      type = "N"
    },
    {
      name = "products"
      type = "L"
    }
  ]
}

variable "server_side_encryption" {
  description = "Configuración de cifrado para la tabla DynamoDB en desarrollo."
  type = object({
    enabled     = bool
    kms_key_arn = string
  })
  default = {
    enabled     = false
    kms_key_arn = ""
  }
}

variable "point_in_time_recovery" {
  description = "Indica si se debe habilitar la recuperación de punto en el tiempo para la tabla en desarrollo."
  type        = bool
  default     = false
}