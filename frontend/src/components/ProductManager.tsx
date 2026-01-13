import { useState } from 'react';
import { Product } from '../App';
import { Pdashboard } from './ProductManager/Pdashboard';
import { Pcategories } from './ProductManager/Pcategories';
import { Pproducts } from './ProductManager/Pproducts';
import { Pstock } from './ProductManager/Pstock';
import { Porders, Order } from './ProductManager/Porders';
import { Previews, ProductReview } from './ProductManager/Previews';

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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'categories' | 'products' | 'stock' | 'orders' | 'reviews'>('dashboard');
  
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

  // Mock reviews data
  const [reviews, setReviews] = useState<ProductReview[]>([
    {
      id: 'REV-001',
      userName: 'Ahmet Yilmaz',
      productName: 'Aspirin 500mg',
      productId: '1',
      rating: 5,
      comment: 'Very effective for headaches. Quick delivery!',
      date: '2024-12-14',
      status: 'approved',
    },
    {
      id: 'REV-002',
      userName: 'Elif Demir',
      productName: 'Vitamin C 1000mg',
      productId: '2',
      rating: 4,
      comment: 'Great quality vitamins. Been using for a month now.',
      date: '2024-12-15',
      status: 'pending',
    },
    {
      id: 'REV-003',
      userName: 'Mehmet Kaya',
      productName: 'Bandages Pack',
      productId: '3',
      rating: 5,
      comment: 'Good value for money. Essential for first aid kit.',
      date: '2024-12-15',
      status: 'pending',
    },
  ]);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab as 'dashboard' | 'categories' | 'products' | 'stock' | 'orders' | 'reviews');
  };

  const handleUpdateOrderStatus = (id: string, status: 'completed' | 'pending' | 'cancelled') => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status } : order
    ));
  };

  const handleUpdateReviewStatus = (id: string, status: 'approved' | 'pending' | 'disapproved') => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, status } : review
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

  if (activeTab === 'reviews') {
    return (
      <Previews
        reviews={reviews}
        onBack={onBack}
        onNavigate={handleNavigate}
        onUpdateReviewStatus={handleUpdateReviewStatus}
      />
    );
  }

  return null;
}