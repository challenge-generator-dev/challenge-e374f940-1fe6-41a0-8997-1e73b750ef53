import { http, HttpResponse, delay } from 'msw';
import type { Order, CreateOrderDto, UpdateOrderDto } from '../types/order';

const ordersDb: Order[] = [
  {
    id: '1',
    customerId: 'customer-001',
    customerName: 'Juan Pérez',
    items: [
      { productId: 'prod-001', productName: 'Laptop Pro', quantity: 1, unitPrice: 1299.99 },
      { productId: 'prod-002', productName: 'Mouse Inalámbrico', quantity: 2, unitPrice: 29.99 }
    ],
    total: 1359.97,
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z'
  },
  {
    id: '2',
    customerId: 'customer-002',
    customerName: 'María García',
    items: [
      { productId: 'prod-003', productName: 'Monitor 27"', quantity: 1, unitPrice: 399.99 }
    ],
    total: 399.99,
    status: 'processing',
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-16T09:15:00Z'
  },
  {
    id: '3',
    customerId: 'customer-003',
    customerName: 'Carlos López',
    items: [
      { productId: 'prod-004', productName: 'Teclado Mecánico', quantity: 1, unitPrice: 149.99 },
      { productId: 'prod-005', productName: 'Alfombrilla XL', quantity: 1, unitPrice: 24.99 }
    ],
    total: 174.98,
    status: 'pending',
    createdAt: '2024-01-17T16:45:00Z',
    updatedAt: '2024-01-17T16:45:00Z'
  }
];

let nextId = 4;

export const handlers = [
  http.get('http://localhost:3000/orders', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const customerId = url.searchParams.get('customerId');
    
    let filteredOrders = [...ordersDb];
    
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }
    
    if (customerId) {
      filteredOrders = filteredOrders.filter(order => order.customerId === customerId);
    }
    
    return HttpResponse.json(filteredOrders);
  }),
  
  http.get('http://localhost:3000/orders/:id', async ({ params }) => {
    await delay(200);
    const order = ordersDb.find(o => o.id === params.id);
    
    if (!order) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(order);
  }),
  
  http.post('http://localhost:3000/orders', async ({ request }) => {
    await delay(400);
    const body = await request.json() as CreateOrderDto;
    
    const newOrder: Order = {
      id: String(nextId++),
      customerId: body.customerId,
      customerName: body.customerName,
      items: body.items,
      total: body.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    ordersDb.push(newOrder);
    return HttpResponse.json(newOrder, { status: 201 });
  }),
  
  http.put('http://localhost:3000/orders/:id', async ({ params, request }) => {
    await delay(300);
    const orderIndex = ordersDb.findIndex(o => o.id === params.id);
    
    if (orderIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    const body = await request.json() as UpdateOrderDto;
    const updatedOrder: Order = {
      ...ordersDb[orderIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    if (body.items) {
      updatedOrder.total = body.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    }
    
    ordersDb[orderIndex] = updatedOrder;
    return HttpResponse.json(updatedOrder);
  }),
  
  http.delete('http://localhost:3000/orders/:id', async ({ params }) => {
    await delay(250);
    const orderIndex = ordersDb.findIndex(o => o.id === params.id);
    
    if (orderIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    ordersDb.splice(orderIndex, 1);
    return new HttpResponse(null, { status: 204 });
  })
];