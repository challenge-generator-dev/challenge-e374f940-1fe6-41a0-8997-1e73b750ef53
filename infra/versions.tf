terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.19.0"
    }
  }
}

# Configuración del proveedor de AWS para todas las regiones y entornos
# El proveedor se configura dinámicamente según el entorno de despliegue
# mediante las variables de entorno AWS_DEFAULT_REGION, AWS_ACCESS_KEY_ID
# y AWS_SECRET_ACCESS_KEY, o mediante archivos de configuración de credenciales
# en ~/.aws/credentials. Para entornos de producción se recomienda usar
# IAM Roles con instancias de EC2 o mediante AWS SSO para evitar credenciales
# hardcodeadas en el código.
#
# Proveedor principal que se utiliza en todo el código de Terraform
# para la creación de recursos de AWS. Este proveedor se configura
# automáticamente cuando se ejecuta terraform init y se vincula
# con el backend de estado configurado en el archivo providers.tf
# de nivel superior del proyecto.
provider "aws" {
  alias  = "region_primary"
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = "order-management-system"
      ManagedBy   = "terraform"
      CreatedBy   = "terraform-module"
    }
  }

  # Configuración de retries para manejar errores transitorios de API
  # AWS puede devolver errores temporales durante operaciones de creación
  # o modificación de recursos, especialmente en entornos de alta demanda
  retries {
    max_attempts = 5
  }
}

# Proveedor secundario para regiones alternativas donde se requiera
# replicación de recursos o despliegue multi-region. Este proveedor
# se utiliza principalmente para tablas de DynamoDB que requieren
# replicación cross-region o para recursos que deben desplegarse
# en múltiples regiones por requisitos de compliance o latencia
provider "aws" {
  alias  = "region_secondary"
  region = var.aws_region_secondary != "" ? var.aws_region_secondary : var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = "order-management-system"
      ManagedBy   = "terraform"
      CreatedBy   = "terraform-module"
      Replica     = "true"
    }
  }
}

# Configuración de endpoints para desarrollo local con LocalStack
# Cuando la variable use_localstack es true, Terraform utilizará
# los endpoints de LocalStack en lugar de los de AWS real. Esto
# permite ejecutar pruebas de infraestructura sin costos de AWS
# y sin necesidad de credenciales reales. Útil para entornos de
# desarrollo y pipelines de CI/CD que necesitan validar la
# configuración de Terraform antes de desplegar a AWS real.
provider "aws" {
  alias  = "localstack"
  region = "us-east-1"

  endpoints {
    dynamodb = "http://localhost:4566"
    sts      = "http://localhost:4566"
  }

  skip_credentials_validation = true
  skip_requesting_account_id  = true
  skip_metadata_api_check     = true
  s3_use_path_style           = true
}
"// === ARCHIVO: infra/README.md ===
# Módulo de Infraestructura para Gestión de Órdenes en DynamoDB

Este módulo de Terraform define la infraestructura necesaria para el sistema de gestión de órdenes en DynamoDB.

## Descripción General

El módulo proporciona la configuración completa para desplegar una tabla de DynamoDB optimizada para operaciones CRUD de órdenes, incluyendo:

- Tabla principal de órdenes con índices secundarios para diferentes patrones de acceso
- Configuración de capacidad aprovisionada o bajo demanda
- Replicación entre regiones si es necesario
- Políticas de lifecycle para gestión de datos
- Configuración de Point-in-Time Recovery
-exportación de información de los recursos creados

## Recursos Definidos

### Tabla de Órdenes (DynamoDB)

La tabla principal de órdenes se configura con los siguientes atributos:

- **order_id**: Identificador único de la orden (clave de partición)
- **customer_id**: Identificador del cliente (índice secundario)
- **status**: Estado de la orden (índice secundario)
- **created_at**: Fecha de creación (tipo timestamp)
- **updated_at**: Fecha de última actualización
- **total_amount**: Monto total de la orden
- **items**: Lista de productos en la orden
- **shipping_address**: Dirección de envío

### Características de la Tabla

- **Mode de capacidad**: Aprovisionado (por defecto) o bajo demanda
- **TTL**: Configurable para auto-eliminación de registros antiguos
- **Point-in-Time Recovery**: Habilitado por defecto para recuperación ante desastres
- **Server-Side Encryption**: Cifrado con AWS owned keys o CMK
- **Streams**: Habilitados para capturar cambios en la tabla

## Uso del Módulo

```hcl
module "order_infrastructure" {
  source = "./infra"

  environment     = "dev"
  aws_region      = "us-east-1"
  table_name      = "orders"
  billing_mode    = "PROVISIONED"
  read_capacity   = 5
  write_capacity  = 5
  enable_ttl      = true
  ttl_attribute   = "expires_at"
  enable_streams  = true
}
```

## Validación Local

Para validar la configuración de Terraform antes de aplicar cambios:

```bash
# Inicializar Terraform
terraform init

# Validar sintaxis y configuración
terraform validate

# Planificar cambios sin aplicar
terraform plan -var-file=environments/dev/terraform.tfvars

# Aplicar cambios (solo en entorno de desarrollo local)
terraform apply -var-file=environments/dev/terraform.tfvars
```

## Variables Requeridas

| Variable | Descripción | Tipo |
|----------|-------------|------|
| `environment` | Entorno de despliegue (dev, staging, prod) | string |
| `aws_region` | Región de AWS donde se crearán los recursos | string |
| `table_name` | Nombre de la tabla de DynamoDB | string |

## Variables Opcionales

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `billing_mode` | Modo de facturación (PROVISIONED o PAY_PER_REQUEST) | PROVISIONED |
| `read_capacity` | Capacidad de lectura para modo aprovisionado | 5 |
| `write_capacity` | Capacidad de escritura para modo aprovisionado | 5 |
| `enable_ttl` | Habilitar Time-To-Live para auto-eliminación | false |
| `ttl_attribute` | Nombre del atributo TTL | expires_at |
| `enable_streams` | Habilitar DynamoDB Streams | true |
| `enable_deletion_protection` | Proteger contra eliminación accidental | true |

## Outputs

El módulo exporta la siguiente información:

- **table_name**: Nombre de la tabla de DynamoDB creada
- **table_arn**: ARN completo de la tabla
- **table_id**: ID único de la tabla
- **stream_arn**: ARN del stream de DynamoDB (si está habilitado)
- **region**: Región donde se desplegó la tabla

## Consideraciones de Seguridad

- El cifrado de datos en reposo está habilitado por defecto
- Se recomienda usar AWS KMS CMK para entornos de producción
- La protección contra eliminación accidental está habilitada por defecto
- Los logs de CloudTrail deben estar habilitados para auditoría

## Costeo Estimado

El coste mensual aproximado para el modo aprovisionado con capacidades mínimas:

- Tabla DynamoDB (5 RCU, 5 WCU): ~$1.25/mes
- Almacenamiento (estimado 1GB): ~$0.25/mes
- Streams (si habilitado): ~$0.02/mes

## Buenas Prácticas

1. Usar nombres descriptivos para los recursos
2. Etiquetar todos los recursos con metadatos relevantes
3. Habilitar Point-in-Time Recovery en producción
4. Usar capacity units mínimos y escalar según demanda
5. Revisar los outputs después de aplicar cambios
6. Mantener el estado de Terraform en backend remoto (S3)
"// === ARCHIVO: infra/main.tf ===
# Configuración Principal de Infraestructura para Gestión de Órdenes
#
# Este archivo define los recursos principales de AWS necesarios para el
# sistema de gestión de órdenes, incluyendo la tabla de DynamoDB principal
# y sus componentes asociados como streams, índices y políticas de acceso.
#
# La arquitectura utiliza el módulo de DynamoDB para crear la tabla de
# manera modular y reusable, permitiendo configuración flexible según
# el entorno de despliegue.

# Módulo de DynamoDB para la tabla de órdenes
# Este módulo encapsula toda la configuración necesaria para crear
# una tabla de DynamoDB optimizada para el caso de uso de gestión de órdenes.
# El módulo maneja la creación de la tabla, índices secundarios, streams
# y configuraciones de seguridad automáticamente.
module "dynamodb_orders" {
  source = "./modules/dynamodb"

  # Nombre de la tabla que se creará en DynamoDB
  # Debe ser único dentro de la cuenta y región de AWS
  table_name = var.table_name

  # Entorno de despliegue para etiquetado y separación lógica
  environment = var.environment

  # Atributos de la clave primaria y secundaria
  # DynamoDB requiere definir todos los atributos que participan
  # en claves primarias y secundarias upfront
  hash_key  = "order_id"
  range_key = "created_at"

  # Atributos adicionales que se almacenan en la tabla
  attributes = [
    {
      name = "order_id"
      type = "S"
    },
    {
      name = "customer_id"
      type = "S"
    },
    {
      name = "status"
      type = "S"
    },
    {
      name = "created_at"
      type = "S"
    },
    {
      name = "updated_at"
      type = "S"
    }
  ]

  # Índice secundario global para consultas por customer_id
  # Permite realizar consultas eficientes de todas las órdenes
  # de un cliente específico sin necesidad de escanear la tabla
  global_secondary_indexes = [
    {
      name            = "customer_id_index"
      hash_key        = "customer_id"
      range_key       = "created_at"
      projection_type = "ALL"
      read_capacity   = var.billing_mode == "PROVISIONED" ? var.read_capacity : null
      write_capacity  = var.billing_mode == "PROVISIONED" ? var.write_capacity : null
    }
  ]

  # Índice secundario local para consultas por estado y fecha
  # Útil para consultas de órdenes por estado en un rango de fechas
  local_secondary_indexes = [
    {
      name          = "status_created_at_index"
      range_key     = "created_at"
      projection_type = "ALL"
    }
  ]

  # Configuración de capacidad de lectura/escritura
  billing_mode    = var.billing_mode
  read_capacity   = var.read_capacity
  write_capacity  = var.write_capacity

  # Configuración de Time-To-Live para auto-eliminación
  # Útil para datos temporales o regulaciones de retención
  enable_ttl    = var.enable_ttl
  ttl_attribute = var.ttl_attribute

  # Habilitar DynamoDB Streams para capturar cambios
  # Necesario para arquitecturas event-driven que reactúan
  # a cambios en las órdenes (actualizaciones de inventario,
  # notificaciones al cliente, etc.)
  enable_streams = var.enable_streams
  stream_view_type = "NEW_AND_OLD_IMAGES"

  # Configuración de cifrado del lado del servidor
  # Usar AWS owned keys para development, CMK para producción
  server_side_encryption_enabled = true
  server_side_encryption_kms_key  = var.kms_key_arn

  # Protección contra eliminación accidental
  # Crítico para entornos de producción donde la pérdida
  # de datos tendría impacto de negocio significativo
  deletion_protection_enabled = var.enable_deletion_protection

  # Configuración de Point-in-Time Recovery
  # Permite restaurar la tabla a cualquier punto en los
  # últimos 35 días. Recomendado para producción.
  point_in_time_recovery_enabled = var.enable_point_in_time_recovery

  # Categorías de destino para auditoría de acceso
  # Configura tablas de CloudTrail o S3 para logging
  audit_config = {
    enabled = var.enable_audit
    log_retention_days = var.audit_log_retention_days
  }
}

# Recurso IAM para permitir acceso a la tabla desde Lambda
# Define una política de acceso que puede ser adjuntada a
# funciones Lambda que necesitan leer/escribir órdenes
resource "aws_iam_policy" "dynamodb_access_policy" {
  name        = "${var.table_name}-access-policy"
  description = "Política de acceso a la tabla de órdenes en DynamoDB"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid = "AllowReadAccessToOrders"
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          module.dynamodb_orders.table_arn,
          "${module.dynamodb_orders.table_arn}/index/*"
        ]
      },
      {
        Sid = "AllowWriteAccessToOrders"
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem"
        ]
        Resource = module.dynamodb_orders.table_arn
      },
      {
        Sid = "AllowStreamReadAccess"
        Effect = "Allow"
        Action = [
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:ListStreams"
        ]
        Resource = module.dynamodb_orders.stream_arn
        Condition = {
          Bool = {
            "dynamodb:StreamViewType" = ["NEW_IMAGE", "OLD_IMAGE", "NEW_AND_OLD_IMAGES"]
          }
        }
      }
    ]
  })

  tags = {
    Name        = "${var.table_name}-access-policy"
    Environment = var.environment
    Project     = "order-management-system"
    ManagedBy   = "terraform"
  }
}

# Alarma de CloudWatch para monitorear throttling de la tabla
# Detecta cuando la tabla está alcanzand su capacidad aprovisionada
# y puede indicar necesidad de increase de capacidad o optimización
resource "aws_cloudwatch_metric_alarm" "throttle_alarm" {
  count = var.billing_mode == "PROVISIONED" ? 1 : 0

  alarm_name          = "${var.table_name}-throttle-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "ThrottledRequests"
  namespace           = "AWS/DynamoDB"
  period              = "300"
  statistic           = "Sum"
  threshold           = "0"
  alarm_description   = "This metric monitors DynamoDB throttling for ${var.table_name}"
  alarm_actions       = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []

  dimensions = {
    TableName = module.dynamodb_orders.table_name
  }

  tags = {
    Name        = "${var.table_name}-throttle-alarm"
    Environment = var.environment
    Project     = "order-management-system"
  }
}

# Alarma de CloudWatch para consumo de capacidad de lectura
# Monitorea el consumo de Read Capacity Units para asegurar
# que la tabla tiene suficiente capacidad aprovisionada
resource "aws_cloudwatch_metric_alarm" "read_capacity_alarm" {
  count = var.billing_mode == "PROVISIONED" ? 1 : 0

  alarm_name          = "${var.table_name}-read-capacity-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "ConsumedReadCapacityUnits"
  namespace           = "AWS/DynamoDB"
  period              = "300"
  statistic           = "Maximum"
  threshold           = var.read_capacity * 80 / 100
  alarm_description   = "This metric monitors DynamoDB read capacity for ${var.table_name}"
  alarm_actions       = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []

  dimensions = {
    TableName = module.dynamodb_orders.table_name
  }

  tags = {
    Name        = "${var.table_name}-read-capacity-alarm"
    Environment = var.environment
    Project     = "order-management-system"
  }
}

# Alarma de CloudWatch para consumo de capacidad de escritura
# Monitorea el consumo de Write Capacity Units para evitar
# escribir errores por capacidad insuficiente
resource "aws_cloudwatch_metric_alarm" "write_capacity_alarm" {
  count = var.billing_mode == "PROVISIONED" ? 1 : 0

  alarm_name          = "${var.table_name}-write-capacity-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "ConsumedWriteCapacityUnits"
  namespace           = "AWS/DynamoDB"
  period              = "300"
  statistic           = "Maximum"
  threshold           = var.write_capacity * 80 / 100
  alarm_description   = "This metric monitors DynamoDB write capacity for ${var.table_name}"
  alarm_actions       = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []

  dimensions = {
    TableName = module.dynamodb_orders.table_name
  }

  tags = {
    Name        = "${var.table_name}-write-capacity-alarm"
    Environment = var.environment
    Project     = "order-management-system"
  }
}

# Recurso opcional de SNS para notificaciones de alarmas
# Solo se crea si se proporciona un topic ARN válido
resource "aws_sns_topic" "alerts_topic" {
  count = var.sns_topic_arn != "" ? 0 : 1

  name         = "${var.environment}-dynamodb-alerts"
  display_name = "Alertas de DynamoDB - ${var.environment}"

  tags = {
    Name        = "${var.environment}-dynamodb-alerts"
    Environment = var.environment
    Project     = "order-management-system"
  }
}

# Data source para importar la clave KMS existente si se especifica
# Si no se especifica, DynamoDB usará cifrado por defecto con AWS owned keys
data "aws_kms_key" "dynamodb_kms" {
  count = var.kms_key_arn != "" ? 1 : 0
  key_id = var.kms_key_arn
}