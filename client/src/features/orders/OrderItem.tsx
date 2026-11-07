import React from 'react';
import { Order } from '@/types/order';

interface OrderItemProps {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
}

export const OrderItem: React.FC<OrderItemProps> = ({ order, onEdit, onDelete }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      processing: 'bg-blue-100 text-blue-800 border-blue-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300'
    };
    return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const calculateTotal = (): string => {
    if (!order.products || order.products.length === 0) {
      return '$0.00';
    }
    const total = order.products.reduce((sum, product) => {
      return sum + (product.price * product.quantity);
    }, 0);
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(total);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Orden #{order.id.slice(0, 8).toUpperCase()}
          </h3>
          <p className="text-sm text-gray-500">
            Cliente: <span className="font-medium">{order.clientName}</span>
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
          {order.status.toUpperCase()}
        </span>
      </div>

      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Productos:</h4>
        <ul className="space-y-1">
          {order.products?.map((product, index) => (
            <li key={index} className="text-sm text-gray-600 flex justify-between">
              <span>{product.name} x{product.quantity}</span>
              <span className="font-medium">${(product.price * product.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          <span className="block">Creada: {formatDate(order.createdAt)}</span>
          {order.updatedAt && (
            <span className="block">Actualizada: {formatDate(order.updatedAt)}</span>
          )}
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">
            Total: {calculateTotal()}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(order)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
        >
          Editar
        </button>
        <button
          onClick={() => {
            if (window.confirm('¿Está seguro de eliminar esta orden?')) {
              onDelete(order.id);
            }
          }}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};