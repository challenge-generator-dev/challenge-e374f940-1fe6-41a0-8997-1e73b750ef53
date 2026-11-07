import { useState, useEffect } from 'react';
import { useOrderStore } from './orderStore';
import { CreateOrderDto, UpdateOrderDto, Order, OrderStatus } from '@/types/order';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

interface OrderFormProps {
  order?: Order | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface OrderItemInput {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export function OrderForm({ order, onSuccess, onCancel }: OrderFormProps) {
  const { createOrder, updateOrder, isLoading, error, clearError } = useOrderStore();
  const isEditing = !!order;

  const [customerId, setCustomerId] = useState(order?.customerId || '');
  const [customerName, setCustomerName] = useState(order?.customerName || '');
  const [items, setItems] = useState<OrderItemInput[]>(
    order?.items?.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })) || [{ productId: '', productName: '', quantity: 1, unitPrice: 0 }]
  );
  const [status, setStatus] = useState<OrderStatus>(order?.status || 'pending');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const addItem = () => {
    setItems([...items, { productId: '', productName: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof OrderItemInput, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };

  const validateForm = (): boolean => {
    if (!customerId.trim()) {
      setFormError('El ID del cliente es obligatorio');
      return false;
    }
    if (!customerName.trim()) {
      setFormError('El nombre del cliente es obligatorio');
      return false;
    }
    const validItems = items.filter(
      (item) => item.productId.trim() && item.productName.trim() && item.quantity > 0
    );
    if (validItems.length === 0) {
      setFormError('Debe agregar al menos un producto');
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const validItems = items
        .filter((item) => item.productId.trim() && item.productName.trim())
        .map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        }));

      if (isEditing && order) {
        const updateData: UpdateOrderDto = {
          customerId,
          customerName,
          items: validItems,
          status,
        };
        await updateOrder(order.id, updateData);
      } else {
        const createData: CreateOrderDto = {
          customerId,
          customerName,
          items: validItems,
          status: 'pending',
        };
        await createOrder(createData);
      }
      onSuccess?.();
    } catch {
      // Error manejado por el store
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit} className="order-form">
      {(error || formError) && (
        <ErrorMessage message={formError || error || ''} onClose={() => {
          setFormError(null);
          clearError();
        }} />
      )}

      <div className="form-section">
        <h3>Información del Cliente</h3>
        <div className="form-group">
          <label htmlFor="customerId">ID del Cliente</label>
          <input
            id="customerId"
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="customerName">Nombre del Cliente</label>
          <input
            id="customerName"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
      </div>

      {isEditing && (
        <div className="form-section">
          <h3>Estado de la Orden</h3>
          <div className="form-group">
            <label htmlFor="status">Estado</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              disabled={isLoading}
            >
              <option value="pending">Pendiente</option>
              <option value="processing">Procesando</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>
        </div>
      )}

      <div className="form-section">
        <h3>Productos</h3>
        {items.map((item, index) => (
          <div key={index} className="item-row">
            <div className="form-group">
              <label htmlFor={`productId-${index}`}>ID Producto</label>
              <input
                id={`productId-${index}`}
                type="text"
                value={item.productId}
                onChange={(e) => updateItem(index, 'productId', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor={`productName-${index}`}>Nombre Producto</label>
              <input
                id={`productName-${index}`}
                type="text"
                value={item.productName}
                onChange={(e) => updateItem(index, 'productName', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor={`quantity-${index}`}>Cantidad</label>
              <input
                id={`quantity-${index}`}
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor={`unitPrice-${index}`}>Precio Unitario</label>
              <input
                id={`unitPrice-${index}`}
                type="number"
                min="0"
                step="0.01"
                value={item.unitPrice}
                onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                disabled={isLoading}
                required
              />
            </div>
            <button
              type="button"
              onClick={() => removeItem(index)}
              disabled={isLoading || items.length === 1}
              className="btn-remove"
            >
              Eliminar
            </button>
          </div>
        ))}
        <button type="button" onClick={addItem} disabled={isLoading} className="btn-add">
          Agregar Producto
        </button>
      </div>

      <div className="form-section total-section">
        <span className="total-label">Total:</span>
        <span className="total-value">${calculateTotal().toFixed(2)}</span>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isLoading} className="btn-submit">
          {isLoading ? 'Guardando...' : isEditing ? 'Actualizar Orden' : 'Crear Orden'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={isLoading} className="btn-cancel">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}