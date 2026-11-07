terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.19.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "Terraform"
    }
  }
}

# Configuración adicional para el proveedor AWS
# que permite manejar características avanzadas de DynamoDB
# como Time to Live (TTL) y Streams para eventos
provider "aws" {
  alias = "secondary"

  region = var.aws_secondary_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "Terraform"
    }
  }
}

# Validación de la región primaria para asegurar
# que coincide con las regiones habilitadas para DynamoDB
locals {
  valid_regions = [
    "us-east-1",
    "us-west-2",
    "eu-west-1",
    "ap-southeast-1"
  ]

  region_validation = contains(local.valid_regions, var.aws_region) ? true : "La región ${var.aws_region} no está soportada para DynamoDB"
}

# Configuración de endpoints para pruebas locales
# cuando se usa LocalStack o DynamoDB Local
resource "aws_dynamodb_endpoint" "local" {
  count             = var.use_localstack ? 1 : 0
  provider          = aws
  service_name      = "dynamodb"
  vpc_endpoint_type = "Interface"
  vpc_id            = var.vpc_id

  security_group_ids = var.security_group_ids

  private_dns_enabled = true
}