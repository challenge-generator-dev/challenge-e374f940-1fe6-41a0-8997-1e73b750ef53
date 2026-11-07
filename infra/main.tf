terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.19"
    }
  }

  backend "local" {
    path = "terraform.tfstate"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = "ordenes-dynamodb"
      ManagedBy   = "terraform"
    }
  }

  dynamic "assume_role" {
    for_each = var.assume_role_arn != "" ? [var.assume_role_arn] : []
    content {
      role_arn = assume_role.value
    }
  }
}

module "dynamodb" {
  source = "./modules/dynamodb"

  environment          = var.environment
  table_name           = var.dynamodb_table_name
  billing_mode         = var.dynamodb_billing_mode
  read_capacity        = var.dynamodb_read_capacity
  write_capacity       = var.dynamodb_write_capacity
  enable_point_in_time_recovery = var.dynamodb_enable_pitr
  enable_server_side_encryption = var.dynamodb_enable_sse
  kms_key_id           = var.dynamodb_kms_key_id
  ttl_attribute_name   = var.dynamodb_ttl_attribute
  tags                 = var.common_tags
}

resource "aws_sns_topic" "ordenes_notifications" {
  count = var.enable_sns_notifications ? 1 : 0

  name             = "ordenes-${var.environment}-notifications"
  display_name     = "Ordenes ${title(var.environment)} Notifications"
  fifo_topic       = false
  content_based_deduplication = false

  tags = merge(var.common_tags, {
    Name = "ordenes-${var.environment}-notifications"
  })
}

resource "aws_cloudwatch_log_group" "ordenes_api" {
  count = var.enable_cloudwatch_logs ? 1 : 0

  name              = "/aws/ordenes/${var.environment}/api"
  retention_in_days = var.cloudwatch_retention_days
  kms_key_id        = var.cloudwatch_kms_key_id

  tags = merge(var.common_tags, {
    Name = "ordenes-${var.environment}-api-logs"
  })
}

resource "aws_kms_key" "ordenes_encryption" {
  count = var.enable_kms_encryption ? 1 : 0

  description             = "KMS key for ordenes ${var.environment} data encryption"
  deletion_window_in_days = 10
  enable_key_rotation     = true

  tags = merge(var.common_tags, {
    Name = "ordenes-${var.environment}-kms-key"
  })
}

resource "aws_kms_alias" "ordenes_encryption_alias" {
  count = var.enable_kms_encryption ? 1 : 0

  name          = "alias/ordenes-${var.environment}"
  target_key_id = aws_kms_key.ordenes_encryption[0].key_id
}

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

locals {
  account_id    = data.aws_caller_identity.current.account_id
  current_region = data.aws_region.current.name

  ordenes_table_arn = module.dynamodb.table_arn
  ordenes_table_id  = module.dynamodb.table_id

  all_tags = merge(
    var.common_tags,
    {
      AccountID = local.account_id
      Region    = local.current_region
    }
  )
}