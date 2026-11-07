import { create } from 'zustand';
import { Order, CreateOrderDto, UpdateOrderDto, OrderStatus } from '../../types/order';
import { OrderService } from '../../services/order.service';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  
  fetchOrders: (status?: OrderStatus, customerId?: string) => Promise<void>;
  fetchOrder: (id: string) => Promise<void>;
  createOrder: (orderData: CreateOrderDto) => Promise<Order>;
  updateOrder: (id: string, orderData: UpdateOrderDto) => Promise<Order>;
  deleteOrder: (id: string) => Promise<void>;
  clearError: () => void;
  clearCurrentOrder: () => void;
}

const orderService = new OrderService();

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  fetchOrders: async (status?: OrderStatus, customerId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (customerId) params.append('customerId', customerId);
      
      const orders = await orderService.listOrders(
        params.toString() ? Object.fromEntries(params) : undefined
      );
      set({ orders, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch orders';
      set({ error: message, isLoading: false });
    }
  },

  fetchOrder: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const order = await orderService.getOrder(id);
      set({ currentOrder: order, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch order';
      set({ error: message, isLoading: false });
    }
  },

  createOrder: async (orderData: CreateOrderDto) => {
    set({ isLoading: true, error: null });
    try {
      const newOrder = await orderService.createOrder(orderData);
      set(state => ({
        orders: [...state.orders, newOrder],
        isLoading: false
      }));
      return newOrder;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create order';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  updateOrder: async (id: string, orderData: UpdateOrderDto) => {
    set({ isLoading: true, error: null });
    try {
      const updatedOrder = await orderService.updateOrder(id, orderData);
      set(state => ({
        orders: state.orders.map(o => o.id === id ? updatedOrder : o),
        currentOrder: state.currentOrder?.id === id ? updatedOrder : state.currentOrder,
        isLoading: false
      }));
      return updatedOrder;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update order';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  deleteOrder: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await orderService.deleteOrder(id);
      set(state => ({
        orders: state.orders.filter(o => o.id !== id),
        currentOrder: state.currentOrder?.id === id ? null : state.currentOrder,
        isLoading: false
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete order';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentOrder: () => set({ currentOrder: null })
}));