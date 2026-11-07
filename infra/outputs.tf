# Outputs de la configuración de Terraform
# Expone la información de los recursos creados para consumo externo

output "dynamodb_table_name" {
  description = "Nombre de la tabla de DynamoDB creada"
  value       = module.dynamodb.table_name
}

output "dynamodb_table_arn" {
  description = "ARN de la tabla de DynamoDB"
  value       = module.dynamodb.table_arn
}

output "dynamodb_table_id" {
  description = "ID de la tabla de DynamoDB"
  value       = module.dynamodb.table_id
}

output "dynamodb_table_endpoint" {
  description = "Endpoint de la tabla de DynamoDB"
  value       = "https://dynamodb.${var.aws_region}.amazonaws.com"
}

output "environment" {
  description = "Entorno donde se desplegó la infraestructura"
  value       = var.environment
}

output "aws_region" {
  description = "Región de AWS donde se desplegó la infraestructura"
  value       = var.aws_region
}

output "dynamodb_tags" {
  description = "Tags aplicados a la tabla de DynamoDB"
  value       = module.dynamodb.table_tags
}