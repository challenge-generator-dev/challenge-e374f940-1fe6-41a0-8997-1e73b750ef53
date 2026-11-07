import React, { useEffect, useState } from 'react';
import { Order } from '@/types/order';
import { orderService } from '@/services/order.service';
import { OrderItem } from './OrderItem';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

interface OrderListProps {
  onEditOrder: (order: Order) => void;
  refreshTrigger?: number;
}

export const OrderList: React.FC<OrderListProps> = ({ onEditOrder, refreshTrigger = 0 }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const fetchOrders = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await orderService.listOrders();
      setOrders(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las órdenes';
      setError(errorMessage);
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [refreshTrigger]);

  const handleDelete = async (id: string): Promise<void> => {
    try {
      setDeleteLoading(id);
      await orderService.deleteOrder(id);
      setOrders(prev => prev.filter(order => order.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la orden';
      setError(errorMessage);
      console.error('Error deleting order:', err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (order: Order): void => {
    onEditOrder(order);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <ErrorMessage 
          message={error} 
          onRetry={fetchOrders}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Lista de Órdenes
        </h2>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
        >
          Actualizar
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-lg">
            No hay órdenes disponibles.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Cree una nueva orden para comenzar.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderItem
              key={order.id}
              order={order}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {deleteLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <LoadingSpinner />
            <p className="mt-2 text-gray-600">Eliminando orden...</p>
          </div>
        </div>
      )}
    </div>
  );
};