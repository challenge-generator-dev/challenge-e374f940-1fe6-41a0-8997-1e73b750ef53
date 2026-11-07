import { IsString, IsArray, IsNumber, IsOptional, ValidateNested, Min, IsEnum, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../../domain/entities/order.entity';

class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly productId!: string;

  @IsNumber()
  @Min(1)
  readonly quantity!: number;

  @IsNumber()
  @Min(0)
  readonly price!: number;
}

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly customerId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductDto)
  @IsOptional()
  readonly products?: UpdateProductDto[];

  @IsEnum(OrderStatus)
  @IsOptional()
  readonly status?: OrderStatus;

  constructor(data?: Partial<UpdateOrderDto>) {
    if (data) {
      this.customerId = data.customerId;
      this.products = data.products;
      this.status = data.status;
    }
  }

  validate(): void {
    if (!this.customerId && !this.products && !this.status) {
      throw new Error('At least one field must be provided for update');
    }

    if (this.products && this.products.length === 0) {
      throw new Error('Products array cannot be empty');
    }

    if (this.products) {
      this.products.forEach((product, index) => {
        if (!product.productId || product.productId.trim() === '') {
          throw new Error(`Product at index ${index} must have a valid productId`);
        }
        if (product.quantity <= 0) {
          throw new Error(`Product at index ${index} must have quantity greater than 0`);
        }
        if (product.price < 0) {
          throw new Error(`Product at index ${index} must have a non-negative price`);
        }
      });
    }
  }
}