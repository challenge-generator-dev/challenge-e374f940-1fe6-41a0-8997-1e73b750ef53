# Configuración de Terraform para el entorno de desarrollo
# Este archivo define los recursos específicos del entorno dev

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.19"
    }
  }

  # Backend remote state para almacenamiento del estado de Terraform
  backend "s3" {
    bucket         = "orders-terraform-state"
    key            = "dev/terraform.tfstate"
    region         = var.aws_region
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

# Proveedor de AWS para el entorno de desarrollo
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = merge(
      var.common_tags,
      var.environment_tags,
      {
        Environment = var.environment
        Terraform   = "true"
      }
    )
  }

  # Configuración de retries para operaciones que pueden fallar temporalmente
  max_retries = 3

  # Habilitar modo de acceso a DynamoDB local para testing
  # Commentar en producción
  # endpoints {
  #   dynamodb = "http://localhost:8000"
  # }
}

# Alias provider para operaciones en regiones alternativas si es necesario
provider "aws" {
  alias  = "secondary_region"
  region = "us-west-2"

  default_tags {
    tags = merge(
      var.common_tags,
      var.environment_tags,
      {
        Environment = "${var.environment}-backup"
        Terraform   = "true"
      }
    )
  }
}

# Módulo de DynamoDB para gestionar la tabla de órdenes
module "dynamodb" {
  source = "../../modules/dynamodb"

  # Nombre de la tabla - específico para desarrollo
  table_name = var.dynamodb_table_name

  # Claves de partición y ordenamiento
  partition_key = var.dynamodb_partition_key
  sort_key      = var.dynamodb_sort_key

  # Configuración de facturación - PAY_PER_REQUEST para desarrollo
  billing_mode = var.dynamodb_billing_mode

  # Configuración de capacidad leída y escrita (solo para PROVISIONED)
  # read_capacity  = var.dynamodb_read_capacity
  # write_capacity = var.dynamodb_write_capacity

  # Habilitar cifrado server-side
  enable_encryption = var.dynamodb_enable_encryption

  # Tipo de cifrado
  # server_side_encryption_kms_key_id = var.dynamodb_kms_key_id
  # server_side_encryption_type       = var.dynamodb_encryption_type

  # Habilitar protección contra eliminación
  enable_deletion_protection = var.dynamodb_enable_deletion_protection

  # Habilitar TTL
  enable_ttl    = var.dynamodb_enable_ttl
  ttl_attribute = var.dynamodb_ttl_attribute

  # Configuración de streams de DynamoDB para captura de cambios
  enable_streams         = true
  stream_view_type       = "NEW_AND_OLD_IMAGES"
  stream_enabled         = true

  # Point-in-time recovery
  enable_point_in_time_recovery = var.enable_point_in_time_recovery

  # Tags específicos del módulo
  tags = merge(
    var.common_tags,
    var.environment_tags,
    {
      Name        = "orders-dynamodb-${var.environment}"
      Description = "Tabla de órdenes para el entorno de desarrollo"
    }
  )
}

# Output local para facilitar referencia en este archivo
locals {
  table_name = module.dynamodb.table_name
  table_arn  = module.dynamodb.table_arn
}

# Resource: Política de acceso a la tabla de DynamoDB para desarrollo
resource "aws_iam_policy" "dynamodb_access_dev" {
  name        = "orders-dynamodb-access-${var.environment}"
  description = "Política de acceso a la tabla de órdenes en entorno de desarrollo"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:DescribeTable",
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator"
        ]
        Resource = [
          module.dynamodb.table_arn,
          "${module.dynamodb.table_arn}/index/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:ListTables"
        ]
        Resource = "*"
      }
    ]
  })

  tags = merge(
    var.common_tags,
    var.environment_tags,
    {
      Name = "orders-dynamodb-access-policy-${var.environment}"
    }
  )
}

# Resource: Asignar política a rol de Lambda (preparado para cuando se implemente la función)
resource "aws_iam_role_policy_attachment" "lambda_dynamodb_access_dev" {
  count = var.enable_lambda_integration ? 1 : 0

  role       = "orders-lambda-role-${var.environment}"
  policy_arn = aws_iam_policy.dynamodb_access_dev.arn
}

# Resource: Alarma de CloudWatch para monitorear throttling en desarrollo
resource "aws_cloudwatch_metric_alarm" "dynamodb_throttle_dev" {
  count = var.enable_monitoring

  alarm_name          = "orders-dynamodb-throttle-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "ThrottledRequests"
  namespace           = "AWS/DynamoDB"
  period              = "300"
  statistic           = "Sum"
  threshold           = "10"
  alarm_description   = "Alarma cuando hay throttling en la tabla de órdenes de desarrollo"
  alarm_actions       = []
  ok_actions          = []

  dimensions = {
    TableName = module.dynamodb.table_name
  }

  tags = merge(
    var.common_tags,
    var.environment_tags,
    {
      Name = "orders-dynamodb-throttle-alarm-${var.environment}"
    }
  )
}

# Resource: Alarma de CloudWatch para consumo de capacidad
resource "aws_cloudwatch_metric_alarm" "dynamodb_consumed_capacity_dev" {
  count = var.enable_monitoring && var.dynamodb_billing_mode == "PROVISIONED"

  alarm_name          = "orders-dynamodb-capacity-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "ConsumedReadCapacityUnits"
  namespace           = "AWS/DynamoDB"
  period              = "300"
  statistic           = "Maximum"
  threshold           = var.dynamodb_read_capacity * 80 / 100
  alarm_description   = "Alarma cuando el consumo de capacidad de lectura supera el 80%"

  dimensions = {
    TableName = module.dynamodb.table_name
  }

  tags = merge(
    var.common_tags,
    var.environment_tags,
    {
      Name = "orders-dynamodb-capacity-alarm-${var.environment}"
    }
  )
}