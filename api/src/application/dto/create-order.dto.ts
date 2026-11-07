import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class ProductDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0.01)
  price: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];

  constructor(customerId: string, products: ProductDto[]) {
    this.customerId = customerId;
    this.products = products;
  }

  validate(): void {
    if (!this.customerId || this.customerId.trim().length === 0) {
      throw new Error('Customer ID is required');
    }
    if (!this.products || this.products.length === 0) {
      throw new Error('At least one product is required');
    }
    if (this.products.some(p => !p.productId || p.quantity <= 0 || p.price <= 0)) {
      throw new Error('Invalid product data');
    }
  }
}