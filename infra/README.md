# Terraform Infrastructure Module

## Overview
This Terraform module provisions AWS infrastructure resources following a modular structure.

## Structure
```
.
├── environments/
│   └── dev/
│       ├── main.tf          # Environment-specific resources
│       ├── terraform.tfvars  # Environment-specific variables
│       └── variables.tf      # Environment-specific variable declarations
├── modules/
│   └── dynamodb/
│       ├── main.tf          # DynamoDB resource definitions
│       ├── outputs.tf        # Module outputs
│       └── variables.tf      # Module input variables
├── providers.tf             # AWS provider configuration
├── variables.tf             # Root module variable declarations
├── versions.tf              # Terraform version constraints
└── outputs.tf               # Root module outputs
```

## Prerequisites
- Terraform >= 1.0.0
- AWS CLI configured with valid credentials
- IAM permissions to create the resources defined in the module

## Setup
1. Navigate to the desired environment directory (e.g., `environments/dev/`)
2. Initialize Terraform:
   ```bash
   terraform init
   ```
3. Review the execution plan:
   ```bash
   terraform plan
   ```
4. Apply the configuration:
   ```bash
   terraform apply
   ```

## Variables
Variables are defined in:
- Root `variables.tf`
- Environment-specific `variables.tf`
- Module-specific `variables.tf`

Environment-specific values are set in `terraform.tfvars` files.

## Outputs
Output values are defined in:
- Root `outputs.tf`
- Module `outputs.tf` files

## Validation
After applying, verify resources were created in the AWS Console or via AWS CLI.

## Cleanup
To destroy the created infrastructure:
```bash
terraform destroy
```