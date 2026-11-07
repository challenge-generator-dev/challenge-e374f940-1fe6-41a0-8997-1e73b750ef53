output "table_name" {
  description = "Nombre de la tabla DynamoDB"
  value       = aws_dynamodb_table.orders.name
}

output "table_arn" {
  description = "ARN de la tabla DynamoDB"
  value       = aws_dynamodb_table.orders.arn
}

output "table_id" {
  description = "ID único de la tabla DynamoDB"
  value       = aws_dynamodb_table.orders.id
}

output "table_stream_arn" {
  description = "ARN del stream de DynamoDB si está habilitado"
  value       = try(aws_dynamodb_table.orders.stream_arn, null)
}

output "table_stream_label" {
  description = "Etiqueta del stream de DynamoDB"
  value       = try(aws_dynamodb_table.orders.stream_label, null)
}

output "table_endpoint" {
  description = "Endpoint de la tabla DynamoDB"
  value       = "https://dynamodb.${data.aws_region.current.name}.amazonaws.com"
}

output "table_region" {
  description = "Región donde está creada la tabla DynamoDB"
  value       = data.aws_region.current.name
}

output "table_items_count" {
  description = "Cantidad de elementos iniciales cargados en la tabla"
  value       = length(var.initial_items != null ? var.initial_items : [])
}

output "gsi_names" {
  description = "Lista de nombres de índices secundarios globales"
  value       = [for gsi in aws_dynamodb_table.orders.global_secondary_index : gsi.name]
}

output "lsi_names" {
  description = "Lista de nombres de índices secundarios locales"
  value       = [for lsi in aws_dynamodb_table.orders.local_secondary_index : lsi.name]
}

output "kms_key_arn" {
  description = "ARN de la clave KMS utilizada para el cifrado"
  value       = var.server_side_encryption ? (var.create_kms_key ? aws_kms_key.dynamodb_table_key[0].arn : var.kms_key_arn) : null
}

output "kms_key_id" {
  description = "ID de la clave KMS utilizada para el cifrado"
  value       = var.server_side_encryption ? (var.create_kms_key ? aws_kms_key.dynamodb_table_key[0].key_id : null) : null
}

output "backup_plan_id" {
  description = "ID del plan de backup si está habilitado"
  value       = var.enable_backup ? aws_backup_plan.dynamodb_backup[0].id : null
}

output "backup_vault_name" {
  description = "Nombre del vault de backup"
  value       = var.enable_backup ? aws_backup_vault.dynamodb_backup_vault[0].name : null
}

output "log_group_name" {
  description = "Nombre del grupo de logs de CloudWatch"
  value       = var.enable_dynamodb_logs ? aws_cloudwatch_log_group.dynamodb_logs[0].name : null
}

output "table_attributes" {
  description = "Lista de atributos definidos en la tabla"
  value       = [for attr in aws_dynamodb_table.orders.attribute : {
    name = attr.name
    type = attr.type
  }]
}

output "table_billing_mode" {
  description = "Modo de facturación de la tabla"
  value       = aws_dynamodb_table.orders.billing_mode
}

output "table_status" {
  description = "Estado actual de la tabla"
  value       = aws_dynamodb_table.orders.status
}

output "table_size_bytes" {
  description = "Tamaño de la tabla en bytes"
  value       = aws_dynamodb_table.orders.size_bytes
}

output "table_item_count" {
  description = "Cantidad de items en la tabla"
  value       = aws_dynamodb_table.orders.item_count
}

output "tags" {
  description = "Etiquetas aplicadas a la tabla"
  value       = aws_dynamodb_table.orders.tags
}

output "partition_key_attribute" {
  description = "Nombre del atributo de clave de partición"
  value       = var.partition_key
}

output "sort_key_attribute" {
  description = "Nombre del atributo de clave de ordenación"
  value       = var.sort_key
}

data "aws_region" "current" {}