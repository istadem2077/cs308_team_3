import { useState } from 'react';
import { Product } from '../services/api';
import { Pdashboard } from './ProductManager/Pdashboard';
import { Pcategories } from './ProductManager/Pcategories';
import { Pproducts } from './ProductManager/Pproducts';
import { Pstock } from './ProductManager/Pstock';
import { Porders, Order } from './ProductManager/Porders';

interface ProductManagerProps {
  products: Product[];
  onBack: () => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: string, product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export function ProductManager({
  products,
  onBack,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}: ProductManagerProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'categories' | 'products' | 'stock' | 'orders'>('dashboard');
  
  // Mock orders data
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'DEL-001',
      customerId: 'CUST-123',
      productName: 'Aspirin 500mg',
      productId: '1',
      quantity: 2,
      totalPrice: 39.98,
      status: 'completed',
      deliveryAddress: 'Sabanci University, Orta Mahalle, Tuzla, Istanbul',
      orderDate: '2024-12-15',
    },
    {
      id: 'DEL-002',
      customerId: 'CUST-456',
      productName: 'Vitamin C 1000mg',
      productId: '2',
      quantity: 1,
      totalPrice: 24.99,
      status: 'pending',
      deliveryAddress: 'Sabanci University, Student Dorms, Tuzla, Istanbul',
      orderDate: '2024-12-16',
    },
    {
      id: 'DEL-003',
      customerId: 'CUST-789',
      productName: 'Bandages Pack',
      productId: '3',
      quantity: 3,
      totalPrice: 44.97,
      status: 'pending',
      deliveryAddress: 'Sabanci University, Faculty Building, Tuzla, Istanbul',
      orderDate: '2024-12-16',
    },
  ]);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab as 'dashboard' | 'categories' | 'products' | 'stock' | 'orders');
  };

  const handleUpdateOrderStatus = (id: string, status: 'completed' | 'pending' | 'cancelled') => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status } : order
    ));
  };

  if (activeTab === 'dashboard') {
    return <Pdashboard products={products} onBack={onBack} onNavigate={handleNavigate} />;
  }

  if (activeTab === 'categories') {
    return <Pcategories products={products} onBack={onBack} onNavigate={handleNavigate} />;
  }

  if (activeTab === 'products') {
    return (
      <Pproducts
        products={products}
        onBack={onBack}
        onNavigate={handleNavigate}
        onAddProduct={onAddProduct}
        onUpdateProduct={onUpdateProduct}
        onDeleteProduct={onDeleteProduct}
      />
    );
  }

  if (activeTab === 'stock') {
    return (
      <Pstock
        products={products}
        onBack={onBack}
        onNavigate={handleNavigate}
        onUpdateProduct={onUpdateProduct}
      />
    );
  }

  if (activeTab === 'orders') {
    return (
      <Porders
        orders={orders}
        onBack={onBack}
        onNavigate={handleNavigate}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />
    );
  }

  return null;
}