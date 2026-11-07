variable "table_name" {
  description = "Nombre de la tabla DynamoDB."
  type        = string
}

variable "billing_mode" {
  description = "Modo de facturación para la tabla DynamoDB (PROVISIONED o PAY_PER_REQUEST)."
  type        = string
  default     = "PAY_PER_REQUEST"

  validation {
    condition     = contains(["PROVISIONED", "PAY_PER_REQUEST"], var.billing_mode)
    error_message = "El modo de facturación debe ser PROVISIONED o PAY_PER_REQUEST."
  }
}

variable "read_capacity" {
  description = "Capacidad de lectura provisionada para la tabla DynamoDB."
  type        = number
  default     = 5
}

variable "write_capacity" {
  description = "Capacidad de escritura provisionada para la tabla DynamoDB."
  type        = number
  default     = 5
}

variable "hash_key" {
  description = "Atributo que se usará como clave hash (partition key) de la tabla."
  type        = string
  default     = "id"
}

variable "range_key" {
  description = "Atributo que se usará como clave de rango (sort key) de la tabla."
  type        = string
  default     = ""
}

variable "attributes" {
  description = "Lista de atributos para la tabla DynamoDB."
  type = list(object({
    name = string
    type = string
  }))
  default = [
    {
      name = "id"
      type = "S"
    }
  ]
}

variable "global_secondary_indexes" {
  description = "Lista de índices secundarios globales para la tabla DynamoDB."
  type = list(object({
    name            = string
    hash_key        = string
    range_key       = string
    projection_type = string
    read_capacity   = number
    write_capacity  = number
    non_key_attributes = list(string)
  }))
  default = []
}

variable "local_secondary_indexes" {
  description = "Lista de índices secundarios locales para la tabla DynamoDB."
  type = list(object({
    name            = string
    range_key       = string
    projection_type = string
    non_key_attributes = list(string)
  }))
  default = []
}

variable "enable_ttl" {
  description = "Indica si se debe habilitar Time to Live (TTL) en la tabla DynamoDB."
  type        = bool
  default     = false
}

variable "ttl_attribute_name" {
  description = "Nombre del atributo que se usará para TTL en DynamoDB."
  type        = string
  default     = "expiration_time"
}

variable "enable_stream" {
  description = "Indica si se debe habilitar el stream de DynamoDB para capturar cambios."
  type        = bool
  default     = false
}

variable "stream_view_type" {
  description = "Tipo de vista del stream de DynamoDB (KEYS_ONLY, NEW_IMAGE, OLD_IMAGE, NEW_AND_OLD_IMAGES)."
  type        = string
  default     = "NEW_AND_OLD_IMAGES"
}

variable "tags" {
  description = "Etiquetas adicionales para la tabla DynamoDB."
  type        = map(string)
  default     = {}
}

variable "point_in_time_recovery" {
  description = "Indica si se debe habilitar la recuperación de punto en el tiempo para la tabla."
  type        = bool
  default     = false
}

variable "server_side_encryption" {
  description = "Configuración de cifrado del lado del servidor para la tabla DynamoDB."
  type = object({
    enabled     = bool
    kms_key_arn = string
  })
  default = {
    enabled     = true
    kms_key_arn = ""
  }
}