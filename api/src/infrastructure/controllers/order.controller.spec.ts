import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from '../../application/services/order.service';
import { Order, OrderStatus } from '../../domain/entities/order.entity';
import { CreateOrderDto } from '../../application/dto/create-order.dto';
import { UpdateOrderDto } from '../../application/dto/update-order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: jest.Mocked<OrderService>;

  const mockOrder: Order = new Order(
    'order-123',
    'customer-456',
    [
      { productId: 'prod-1', quantity: 2, price: 100.0 },
      { productId: 'prod-2', quantity: 1, price: 50.0 },
    ],
    new Date('2024-01-15T10:00:00Z'),
    OrderStatus.PENDING,
  );

  beforeEach(async () => {
    const mockOrderService = {
      createOrder: jest.fn(),
      getOrder: jest.fn(),
      updateOrder: jest.fn(),
      deleteOrder: jest.fn(),
      listOrders: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const createDto = new CreateOrderDto('customer-456', [
        { productId: 'prod-1', quantity: 2, price: 100.0 },
      ]);
      orderService.createOrder.mockResolvedValue(mockOrder);

      const result = await controller.createOrder(createDto);

      expect(orderService.createOrder).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockOrder);
    });

    it('should throw BadRequestException when validation fails', async () => {
      const createDto = new CreateOrderDto('', []);
      
      await expect(controller.createOrder(createDto)).rejects.toThrow(BadRequestException);
      expect(orderService.createOrder).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on service error', async () => {
      const createDto = new CreateOrderDto('customer-456', [
        { productId: 'prod-1', quantity: 1, price: 100.0 },
      ]);
      orderService.createOrder.mockRejectedValue(new Error('Database error'));

      await expect(controller.createOrder(createDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getOrder', () => {
    it('should return an order when found', async () => {
      orderService.getOrder.mockResolvedValue(mockOrder);

      const result = await controller.getOrder('order-123');

      expect(orderService.getOrder).toHaveBeenCalledWith('order-123');
      expect(result).toEqual(mockOrder);
    });

    it('should throw NotFoundException when order not found', async () => {
      orderService.getOrder.mockResolvedValue(null);

      await expect(controller.getOrder('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on service error', async () => {
      orderService.getOrder.mockRejectedValue(new Error('Database connection failed'));

      await expect(controller.getOrder('order-123')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('listOrders', () => {
    it('should return all orders', async () => {
      const orders = [mockOrder, { ...mockOrder, id: 'order-456' }];
      orderService.listOrders.mockResolvedValue(orders);

      const result = await controller.listOrders();

      expect(orderService.listOrders).toHaveBeenCalled();
      expect(result).toEqual(orders);
    });

    it('should return empty array when no orders exist', async () => {
      orderService.listOrders.mockResolvedValue([]);

      const result = await controller.listOrders();

      expect(orderService.listOrders).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should throw InternalServerErrorException on service error', async () => {
      orderService.listOrders.mockRejectedValue(new Error('DynamoDB error'));

      await expect(controller.listOrders()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('updateOrder', () => {
    it('should update an order successfully', async () => {
      const updateDto = new UpdateOrderDto();
      updateDto.customerId = 'new-customer';
      const updatedOrder = { ...mockOrder, customerId: 'new-customer' };
      orderService.updateOrder.mockResolvedValue(updatedOrder as Order);

      const result = await controller.updateOrder('order-123', updateDto);

      expect(orderService.updateOrder).toHaveBeenCalledWith('order-123', updateDto);
      expect(result).toEqual(updatedOrder);
    });

    it('should throw NotFoundException when order to update not found', async () => {
      const updateDto = new UpdateOrderDto();
      updateDto.customerId = 'new-customer';
      orderService.updateOrder.mockResolvedValue(null);

      await expect(controller.updateOrder('non-existent', updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on service error', async () => {
      const updateDto = new UpdateOrderDto();
      updateDto.customerId = 'new-customer';
      orderService.updateOrder.mockRejectedValue(new Error('Update failed'));

      await expect(controller.updateOrder('order-123', updateDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('deleteOrder', () => {
    it('should delete an order successfully', async () => {
      orderService.getOrder.mockResolvedValue(mockOrder);
      orderService.deleteOrder.mockResolvedValue();

      await controller.deleteOrder('order-123');

      expect(orderService.getOrder).toHaveBeenCalledWith('order-123');
      expect(orderService.deleteOrder).toHaveBeenCalledWith('order-123');
    });

    it('should throw NotFoundException when order to delete not found', async () => {
      orderService.getOrder.mockResolvedValue(null);

      await expect(controller.deleteOrder('non-existent')).rejects.toThrow(NotFoundException);
      expect(orderService.deleteOrder).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on service error', async () => {
      orderService.getOrder.mockResolvedValue(mockOrder);
      orderService.deleteOrder.mockRejectedValue(new Error('Delete failed'));

      await expect(controller.deleteOrder('order-123')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
}