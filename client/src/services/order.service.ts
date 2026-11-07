import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { Order, CreateOrderDto, UpdateOrderDto, ApiError } from '@/types/order';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class OrderService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response) {
          const errorData = error.response.data;
          console.error('API Error Response:', {
            status: error.response.status,
            message: errorData?.message || error.message,
            code: errorData?.code,
          });
          return Promise.reject(new Error(errorData?.message || 'Error en la solicitud'));
        } else if (error.request) {
          console.error('API No Response:', error.message);
          return Promise.reject(new Error('No se recibió respuesta del servidor'));
        } else {
          console.error('API Request Error:', error.message);
          return Promise.reject(new Error('Error al procesar la solicitud'));
        }
      }
    );
  }

  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    const response: AxiosResponse<Order> = await this.client.post<Order>('/orders', orderData);
    return response.data;
  }

  async getOrder(id: string): Promise<Order> {
    if (!id || id.trim() === '') {
      throw new Error('El ID de la orden es requerido');
    }
    const response: AxiosResponse<Order> = await this.client.get<Order>(`/orders/${id}`);
    return response.data;
  }

  async updateOrder(id: string, orderData: UpdateOrderDto): Promise<Order> {
    if (!id || id.trim() === '') {
      throw new Error('El ID de la orden es requerido');
    }
    const response: AxiosResponse<Order> = await this.client.put<Order>(`/orders/${id}`, orderData);
    return response.data;
  }

  async deleteOrder(id: string): Promise<void> {
    if (!id || id.trim() === '') {
      throw new Error('El ID de la orden es requerido');
    }
    await this.client.delete(`/orders/${id}`);
  }

  async listOrders(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    customerId?: string;
  }): Promise<Order[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.pageSize) {
      queryParams.append('pageSize', params.pageSize.toString());
    }
    if (params?.status) {
      queryParams.append('status', params.status);
    }
    if (params?.customerId) {
      queryParams.append('customerId', params.customerId);
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/orders?${queryString}` : '/orders';
    
    const response: AxiosResponse<Order[]> = await this.client.get<Order[]>(url);
    return response.data;
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    const response: AxiosResponse<Order[]> = await this.client.get<Order[]>(`/orders?status=${status}`);
    return response.data;
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    if (!customerId || customerId.trim() === '') {
      throw new Error('El ID del cliente es requerido');
    }
    const response: AxiosResponse<Order[]> = await this.client.get<Order[]>(`/orders?customerId=${customerId}`);
    return response.data;
  }
}

export const orderService = new OrderService();
export default orderService;