import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DynamoDBClient,
  DynamoDBClientConfig,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { Order } from '../../../domain/entities/order.entity';
import { OrderRepository } from '../../../domain/repositories/order.repository';

@Injectable()
export class DynamoDBOrderRepository implements OrderRepository, OnModuleInit, OnModuleDestroy {
  private client: DynamoDBClient;
  private tableName: string;

  constructor(private readonly configService: ConfigService) {
    const config: DynamoDBClientConfig = {
      region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
      },
    };

    const endpoint = this.configService.get<string>('DYNAMODB_ENDPOINT');
    if (endpoint) {
      config.endpoint = endpoint;
    }

    this.client = new DynamoDBClient(config);
    this.tableName = this.configService.get<string>('DYNAMODB_TABLE_NAME', 'orders');
  }

  async onModuleInit(): Promise<void> {
    console.log('DynamoDB Order Repository initialized');
  }

  async onModuleDestroy(): Promise<void> {
    this.client.destroy();
  }

  private toDynamoDBItem(order: Order): Record<string, unknown> {
    return {
      id: order.id,
      customerId: order.customerId,
      products: order.products,
      createdAt: order.createdAt.toISOString(),
      totalAmount: order.getTotalAmount(),
      status: order instanceof Order ? this.getStatusValue(order) : 'PENDING',
    };
  }

  private getStatusValue(order: Order): string {
    const statusMap: Record<string, string> = {
      PENDING: 'PENDING',
      CONFIRMED: 'CONFIRMED',
      SHIPPED: 'SHIPPED',
      DELIVERED: 'DELIVERED',
      CANCELLED: 'CANCELLED',
    };
    const statusKey = Object.keys(statusMap).find(
      (key) => (OrderStatus as Record<string, unknown>)[key] === order.status,
    );
    return statusKey ? statusMap[statusKey] : 'PENDING';
  }

  private fromDynamoDBItem(item: Record<string, unknown> | undefined): Order | null {
    if (!item) return null;

    const { OrderStatus } = require('../../../domain/entities/order.entity');
    
    const products = (item.products as Array<{ productId: string; quantity: number; price: number }>) || [];
    const createdAt = item.createdAt ? new Date(item.createdAt as string) : new Date();
    const statusValue = (item.status as string) || 'PENDING';
    const status = (OrderStatus as Record<string, OrderStatus>)[statusValue] || OrderStatus.PENDING;

    const order = new Order(
      item.id as string,
      item.customerId as string,
      products,
      createdAt,
      status,
    );

    return order;
  }

  async create(order: Order): Promise<Order> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: this.toDynamoDBItem(order),
      ConditionExpression: 'attribute_not_exists(id)',
    });

    await this.client.send(command);
    console.log(`Order ${order.id} created successfully in DynamoDB`);
    return order;
  }

  async findById(id: string): Promise<Order | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { id },
    });

    const result = await this.client.send(command);
    return this.fromDynamoDBItem(result.Item as Record<string, unknown> | undefined);
  }

  async update(order: Order): Promise<Order> {
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { id: order.id },
      UpdateExpression: 'SET customerId = :customerId, products = :products, #status = :status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':customerId': order.customerId,
        ':products': order.products,
        ':status': this.getStatusValue(order),
      },
      ReturnValues: 'ALL_NEW',
    });

    const result = await this.client.send(command);
    console.log(`Order ${order.id} updated successfully in DynamoDB`);
    return this.fromDynamoDBItem(result.Attributes as Record<string, unknown>) || order;
  }

  async delete(id: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: { id },
    });

    await this.client.send(command);
    console.log(`Order ${id} deleted successfully from DynamoDB`);
  }

  async findAll(): Promise<Order[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
    });

    const result = await this.client.send(command);
    const items = result.Items || [];
    return items
      .map((item) => this.fromDynamoDBItem(item as Record<string, unknown>))
      .filter((order): order is Order => order !== null);
  }
}

import { OrderStatus } from '../../../domain/entities/order.entity';