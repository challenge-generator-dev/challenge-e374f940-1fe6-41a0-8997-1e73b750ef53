import { Routes, Route, Navigate } from 'react-router-dom';
import { useOrderStore } from './features/orders/orderStore';
import { OrderList } from './features/orders/OrderList';
import { OrderForm } from './features/orders/OrderForm';
import { ErrorMessage } from './shared/components/ErrorMessage';
import { LoadingSpinner } from './shared/components/LoadingSpinner';

function App() {
  const { error, isLoading, clearError } = useOrderStore();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Gestión de Órdenes</h1>
        <p>Sistema de gestión de órdenes en DynamoDB</p>
      </header>

      <main className="app-main">
        {error && (
          <ErrorMessage 
            message={error} 
            onClose={clearError}
          />
        )}

        {isLoading && <LoadingSpinner />}

        <Routes>
          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/orders/new" element={<OrderForm />} />
          <Route path="/orders/:id/edit" element={<OrderForm />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;