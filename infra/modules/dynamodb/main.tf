resource "aws_dynamodb_table" "orders" {
  name           = var.table_name
  billing_mode   = var.billing_mode
  hash_key       = var.partition_key
  range_key      = var.sort_key

  dynamic "attribute" {
    for_each = var.attributes
    content {
      name = attribute.value.name
      type = attribute.value.type
    }
  }

  tags = merge(
    var.tags,
    {
      "Name"        = var.table_name
      "Environment" = var.environment
      "ManagedBy"   = "Terraform"
      "Project"     = var.project_name
    }
  )

  lifecycle {
    ignore_changes = [tags]
  }

  dynamic "global_secondary_index" {
    for_each = var.gsi_definition
    content {
      name            = global_secondary_index.value.name
      hash_key        = global_secondary_index.value.hash_key
      range_key       = try(global_secondary_index.value.range_key, null)
      projection_type = global_secondary_index.value.projection_type
      read_capacity   = try(global_secondary_index.value.read_capacity, null)
      write_capacity  = try(global_secondary_index.value.write_capacity, null)
    }
  }

  dynamic "local_secondary_index" {
    for_each = var.lsi_definition
    content {
      name            = local_secondary_index.value.name
      range_key       = local_secondary_index.value.range_key
      projection_type = local_secondary_index.value.projection_type
    }
  }

  server_side_encryption {
    enabled     = var.server_side_encryption
    kms_key_arn = var.kms_key_arn
  }

  point_in_time_recovery {
    enabled = var.point_in_time_recovery
  }

  ttl {
    enabled        = var.ttl_enabled
    attribute_name = var.ttl_attribute_name
  }

  stream_enabled   = var.stream_enabled
  stream_view_type = var.stream_view_type

  timeouts {
    create = var.timeouts_create
    update = var.timeouts_update
    delete = var.timeouts_delete
  }
}

resource "aws_dynamodb_table_item" "seed_data" {
  for_each = var.initial_items != null ? { for item in var.initial_items : item[var.partition_key] => item } : {}

  table_name = aws_dynamodb_table.orders.name
  hash_key   = each.value[var.partition_key]

  dynamic "range_key" {
    for_each = var.sort_key != null ? [1] : []
    content {
      S = each.value[var.sort_key]
    }
  }

  item = jsonencode(each.value)
}

resource "aws_cloudwatch_log_group" "dynamodb_logs" {
  count              = var.enable_dynamodb_logs ? 1 : 0
  name               = "/aws/dynamodb/${var.table_name}"
  retention_in_days = var.log_retention_days
  kms_key_id         = var.log_kms_key_arn

  tags = merge(
    var.tags,
    {
      "Name"        = "${var.table_name}-logs"
      "Environment" = var.environment
    }
  )
}

resource "aws_kms_key" "dynamodb_table_key" {
  count                   = var.create_kms_key && var.server_side_encryption ? 1 : 0
  description             = "KMS key for DynamoDB table ${var.table_name}"
  deletion_window_in_days = var.kms_deletion_window
  enable_key_rotation     = var.kms_enable_key_rotation

  tags = merge(
    var.tags,
    {
      "Name"        = "${var.table_name}-kms-key"
      "Environment" = var.environment
    }
  )
}

resource "aws_kms_alias" "dynamodb_table_key_alias" {
  count          = var.create_kms_key && var.server_side_encryption ? 1 : 0
  name           = "alias/${var.table_name}-key"
  target_key_id  = aws_kms_key.dynamodb_table_key[0].key_id
}

data "aws_iam_policy_document" "dynamodb_kms_policy" {
  count = var.create_kms_key && var.server_side_encryption ? 1 : 0

  statement {
    sid = "Enable IAM User Permissions"
    effect = "Allow"
    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"]
    }
    actions   = ["kms:*"]
    resources = ["*"]
  }

  statement {
    sid = "Allow DynamoDB to use the key"
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["dynamodb.amazonaws.com"]
    }
    actions = [
      "kms:Encrypt",
      "kms:Decrypt",
      "kms:ReEncrypt*",
      "kms:GenerateDataKey*",
      "kms:DescribeKey",
      "kms:CreateGrant"
    ]
    resources = [aws_kms_key.dynamodb_table_key[0].arn]
    condition {
      test     = "StringEquals"
      variable = "kms:CallerAccount"
      values   = [data.aws_caller_identity.current.account_id]
    }
  }
}

resource "aws_kms_key_policy" "dynamodb_kms_policy" {
  count  = var.create_kms_key && var.server_side_encryption ? 1 : 0
  key_id = aws_kms_key.dynamodb_table_key[0].id
  policy = data.aws_iam_policy_document.dynamodb_kms_policy[0].json
}

data "aws_caller_identity" "current" {}

resource "aws_backup_plan" "dynamodb_backup" {
  count = var.enable_backup ? 1 : 0
  name  = "${var.table_name}-backup-plan"

  rule {
    name             = "daily-backup"
    schedule         = var.backup_schedule
    target_vault_name = var.backup_vault_name
    start_window     = var.backup_start_window
    completion_window = var.backup_completion_window
    lifecycle {
      cold_storage_after = var.backup_cold_storage_after
      delete_after       = var.backup_delete_after
    }
  }

  tags = merge(
    var.tags,
    {
      "Name"        = "${var.table_name}-backup-plan"
      "Environment" = var.environment
    }
  )
}

resource "aws_backup_selection" "dynamodb_backup_selection" {
  count     = var.enable_backup ? 1 : 0
  name      = "${var.table_name}-backup-selection"
  plan_id   = aws_backup_plan.dynamodb_backup[0].id
  resources = [aws_dynamodb_table.orders.arn]

  condition {
    string_eq {
      key   = "aws:ResourceTag/Environment"
      value = var.environment
    }
  }
}

resource "aws_backup_vault" "dynamodb_backup_vault" {
  count = var.enable_backup ? 1 : 0
  name  = var.backup_vault_name

  kms_key_arn = var.backup_vault_kms_key_arn

  tags = merge(
    var.tags,
    {
      "Name"        = "${var.table_name}-backup-vault"
      "Environment" = var.environment
    }
  )
}