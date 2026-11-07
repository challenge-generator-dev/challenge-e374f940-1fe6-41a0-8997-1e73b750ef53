variable "aws_region" {
  description = "Región principal de AWS donde se desplegarán los recursos."
  type        = string
  default     = "us-east-1"

  validation {
    condition     = contains(["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"], var.aws_region)
    error_message = "La región debe ser una de las siguientes: us-east-1, us-west-2, eu-west-1, ap-southeast-1."
  }
}

variable "aws_secondary_region" {
  description = "Región secundaria de AWS para réplicas o recursos adicionales."
  type        = string
  default     = "us-west-2"
}

variable "environment" {
  description = "Entorno de despliegue (dev, staging, prod)."
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "El entorno debe ser uno de: dev, staging, prod."
  }
}

variable "project_name" {
  description = "Nombre del proyecto para etiquetar recursos."
  type        = string
  default     = "order-management"
}

variable "use_localstack" {
  description = "Indica si se debe configurar para usar LocalStack en lugar de AWS real."
  type        = bool
  default     = false
}

variable "vpc_id" {
  description = "ID de la VPC donde se crearán los endpoints para DynamoDB Local."
  type        = string
  default     = ""
}

variable "security_group_ids" {
  description = "IDs de los security groups para los endpoints de DynamoDB Local."
  type        = list(string)
  default     = []
}

variable "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB para órdenes."
  type        = string
  default     = "orders"
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
  description = "Capacidad de lectura provisionada para la tabla DynamoDB (solo aplicable si billing_mode es PROVISIONED)."
  type        = number
  default     = 5
}

variable "write_capacity" {
  description = "Capacidad de escritura provisionada para la tabla DynamoDB (solo aplicable si billing_mode es PROVISIONED)."
  type        = number
  default     = 5
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

  validation {
    condition     = contains(["KEYS_ONLY", "NEW_IMAGE", "OLD_IMAGE", "NEW_AND_OLD_IMAGES"], var.stream_view_type)
    error_message = "El tipo de vista del stream debe ser uno de: KEYS_ONLY, NEW_IMAGE, OLD_IMAGE, NEW_AND_OLD_IMAGES."
  }
}