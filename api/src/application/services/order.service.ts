import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { Order, OrderStatus } from '../../domain/entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      createOrderDto.validate();

      const order = new Order(
        this.generateOrderId(),
        createOrderDto.customerId,
        createOrderDto.products.map(p => ({
          productId: p.productId,
          quantity: p.quantity,
          price: p.price,
        })),
        new Date(),
        OrderStatus.PENDING,
      );

      return await this.orderRepository.create(order);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create order', error.message);
    }
  }

  async getOrder(id: string): Promise<Order> {
    if (!id || id.trim() === '') {
      throw new BadRequestException('Order ID is required');
    }

    try {
      const order = await this.orderRepository.findById(id);

      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      return order;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve order', error.message);
    }
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    if (!id || id.trim() === '') {
      throw new BadRequestException('Order ID is required');
    }

    try {
      const existingOrder = await this.orderRepository.findById(id);

      if (!existingOrder) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      if (updateOrderDto.status) {
        existingOrder.updateStatus(updateOrderDto.status);
      }

      const updatedProducts = updateOrderDto.products 
        ? updateOrderDto.products.map(p => ({
            productId: p.productId,
            quantity: p.quantity,
            price: p.price,
          }))
        : existingOrder.products;

      const updatedCustomerId = updateOrderDto.customerId || existingOrder.customerId;

      const updatedOrder = new Order(
        existingOrder.id,
        updatedCustomerId,
        updatedProducts,
        existingOrder.createdAt,
        existingOrder.products && existingOrder.products.length > 0 
          ? OrderStatus.PROCESSING 
          : OrderStatus.PENDING,
      );

      return await this.orderRepository.update(updatedOrder);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update order', error.message);
    }
  }

  async deleteOrder(id: string): Promise<void> {
    if (!id || id.trim() === '') {
      throw new BadRequestException('Order ID is required');
    }

    try {
      const existingOrder = await this.orderRepository.findById(id);

      if (!existingOrder) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      await this.orderRepository.delete(id);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete order', error.message);
    }
  }

  async listOrders(): Promise<Order[]> {
    try {
      return await this.orderRepository.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to list orders', error.message);
    }
  }

  private generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `ORD-${timestamp}-${randomPart}`.toUpperCase();
  }
}