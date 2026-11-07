import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { OrderController } from './infrastructure/controllers/order.controller';
import { OrderService } from './application/services/order.service';
import { DynamoDBOrderRepository } from './infrastructure/repositories/dynamodb/order.repository';
import { GlobalExceptionFilter } from '../infrastructure/filters/global-exception.filter';
import { dynamoDbConfig } from './config/dynamodb.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dynamoDbConfig],
    }),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    DynamoDBOrderRepository,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
"// === ARCHIVO: infrastructure/filters/global-exception.filter.ts ===
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let error = 'Internal Server Error';
    let details: unknown = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || exception.message;
        error = (responseObj.error as string) || error;
        details = responseObj.details;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack,
      );
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error,
      message,
      ...(details && { details }),
    };

    this.logger.error(
      `${request.method} ${request.url} ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json(errorResponse);
  }
}