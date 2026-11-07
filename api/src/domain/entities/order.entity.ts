import { v4 as uuidv4 } from 'uuid';

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export class Order {
  readonly id: string;
  readonly customerId: string;
  readonly products: Array<{ productId: string; quantity: number; price: number }>;
  status: OrderStatus;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(
    customerId: string,
    products: Array<{ productId: string; quantity: number; price: number }>,
    status: OrderStatus = OrderStatus.PENDING
  ) {
    if (!customerId || customerId.trim().length === 0) {
      throw new Error('Customer ID is required');
    }
    if (!products || products.length === 0) {
      throw new Error('At least one product is required');
    }
    if (products.some(p => !p.productId || p.quantity <= 0 || p.price <= 0)) {
      throw new Error('Invalid product data');
    }

    this.id = uuidv4();
    this.customerId = customerId;
    this.products = products;
    this.status = status;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  updateStatus(newStatus: OrderStatus): void {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
      [OrderStatus.COMPLETED]: [],
      [OrderStatus.CANCELLED]: []
    };

    if (!validTransitions[this.status].includes(newStatus)) {
      throw new Error(`Cannot transition from ${this.status} to ${newStatus}`);
    }

    this.status = newStatus;
    this.updatedAt = new Date();
  }

  getTotalAmount(): number {
    return this.products.reduce((total, product) => total + (product.quantity * product.price), 0);
  }
}