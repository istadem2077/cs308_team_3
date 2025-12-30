import { useState } from 'react';
import { Product } from '../services/api';
import { Pdashboard } from './ProductManager/Pdashboard';
import { Pcategories } from './ProductManager/Pcategories';
import { Pproducts } from './ProductManager/Pproducts';
import { Pstock } from './ProductManager/Pstock';

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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'categories' | 'products' | 'stock'>('dashboard');

  const handleNavigate = (tab: string) => {
    setActiveTab(tab as 'dashboard' | 'categories' | 'products' | 'stock');
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

  return null;
}