# Variables específicas para el entorno de desarrollo
# Estas variables sobrescriben los valores por defecto definidos en variables.tf

environment = "dev"
aws_region  = "us-east-1"

# Configuración de la tabla de DynamoDB para desarrollo
dynamodb_table_name = "orders-dev"
dynamodb_partition_key = "orderId"
dynamodb_sort_key      = "customerId"

# Configuración de capacidad bajo demanda para desarrollo (paga por uso)
dynamodb_billing_mode = "PAY_PER_REQUEST"

# Habilitar server-side encryption
dynamodb_enable_encryption = true

# Habilitar eliminación lógica (soft delete)
dynamodb_enable_deletion_protection = false

# Configuración de TTL para limpieza automática de órdenes antiguas
dynamodb_enable_ttl     = true
dynamodb_ttl_attribute  = "expirationTime"

# Tags específicos para el entorno de desarrollo
environment_tags = {
  Environment = "development"
  CostCenter  = "engineering"
  Project     = "orders-management"
  ManagedBy   = "terraform"
}

# Configuración de lifecycle para desarrollo
enable_versioning = false

# Configuración de backups point-in-time recovery
enable_point_in_time_recovery = false