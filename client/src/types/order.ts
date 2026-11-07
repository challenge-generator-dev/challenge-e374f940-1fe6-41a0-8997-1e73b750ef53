export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderDto {
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  items?: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}