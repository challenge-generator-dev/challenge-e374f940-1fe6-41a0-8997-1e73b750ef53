import { Order } from '../entities/order.entity';

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  update(order: Order): Promise<Order>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Order[]>;
}