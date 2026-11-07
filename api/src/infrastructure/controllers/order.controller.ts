import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Order } from '../../domain/entities/order.entity';
import { OrderService } from '../../application/services/order.service';
import { CreateOrderDto } from '../../application/dto/create-order.dto';
import { UpdateOrderDto } from '../../application/dto/update-order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully', type: Order })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    this.logger.log(`Creating order for customer: ${createOrderDto.customerId}`);
    
    try {
      createOrderDto.validate();
      const order = await this.orderService.createOrder(createOrderDto);
      this.logger.log(`Order created with ID: ${order.id}`);
      return order;
    } catch (error) {
      this.logger.error(`Failed to create order: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create order');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order found', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getOrder(@Param('id') id: string): Promise<Order> {
    this.logger.log(`Fetching order with ID: ${id}`);
    
    try {
      const order = await this.orderService.getOrder(id);
      if (!order) {
        this.logger.warn(`Order not found: ${id}`);
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch order: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch order');
    }
  }

  @Get()
  @ApiOperation({ summary: 'List all orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully', type: [Order] })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async listOrders(): Promise<Order[]> {
    this.logger.log('Fetching all orders');
    
    try {
      const orders = await this.orderService.listOrders();
      this.logger.log(`Retrieved ${orders.length} orders`);
      return orders;
    } catch (error) {
      this.logger.error(`Failed to list orders: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to list orders');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({ status: 200, description: 'Order updated successfully', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    this.logger.log(`Updating order with ID: ${id}`);
    
    try {
      const order = await this.orderService.updateOrder(id, updateOrderDto);
      if (!order) {
        this.logger.warn(`Order not found for update: ${id}`);
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      this.logger.log(`Order ${id} updated successfully`);
      return order;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to update order: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update order');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 204, description: 'Order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deleteOrder(@Param('id') id: string): Promise<void> {
    this.logger.log(`Deleting order with ID: ${id}`);
    
    try {
      const exists = await this.orderService.getOrder(id);
      if (!exists) {
        this.logger.warn(`Order not found for deletion: ${id}`);
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      await this.orderService.deleteOrder(id);
      this.logger.log(`Order ${id} deleted successfully`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to delete order: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to delete order');
    }
  }
}