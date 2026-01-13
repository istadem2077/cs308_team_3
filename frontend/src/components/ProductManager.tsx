import { useState, useEffect } from 'react';
import { Product } from '../App';
import { Pdashboard } from './ProductManager/Pdashboard';
import { Pcategories } from './ProductManager/Pcategories';
import { Pproducts } from './ProductManager/Pproducts';
import { Pstock } from './ProductManager/Pstock';
import { Porders, Order } from './ProductManager/Porders';
import { Previews, ProductReview } from './ProductManager/Previews';
import { productsAPI } from '../services/api'; // Standard user API for fetching
import { productManagerAPI } from '../services/managerApi';

interface ProductManagerProps {
  onBack: () => void;
  onLogout: () => void; // Added interface definition
  // ... other props if any (in App.tsx usage above, products/onAdd etc are passed, but standard interface shown in file content was simpler. I will keep your file's structure)
  products?: any[]; // Adjusting based on your usage in App.tsx vs file content. The file content had minimal props. I will stick to file content structure + onLogout.
  [key: string]: any;
}

export function ProductManager({ onBack, onLogout, ...props }: ProductManagerProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'categories' | 'products' | 'stock' | 'orders' | 'reviews'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [deliveries, setDeliveries] = useState<Order[]>([]); // State for real deliveries
  const [reviews, setReviews] = useState<ProductReview[]>([]); // State for real reviews
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([loadProducts(), loadDeliveries(), loadReviews()]);
    setLoading(false);
  };

  const loadProducts = async () => {
    try {
      const data = await productsAPI.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products", error);
    }
  };

  const loadDeliveries = async () => {
    try {
      // Fetch DeliveryItemDto[] from backend
      const data = await productManagerAPI.getDeliveries();

      // Map DTO to Frontend Order Interface
      const mappedOrders: Order[] = data.map((d: any) => ({
        id: d.deliveryId.toString(),
        customerId: d.customerId ? d.customerId.toString() : 'N/A',
        productId: d.productId.toString(),
        productName: d.productName || 'Unknown Product',
        quantity: d.quantity,
        totalPrice: d.totalPrice,
        status: d.status.toLowerCase() as 'completed' | 'pending' | 'cancelled',
        deliveryAddress: d.deliveryAddress,
        orderDate: new Date().toISOString().split('T')[0] // Backend DTO doesn't have date yet, defaulting to today
      }));
      setDeliveries(mappedOrders);
    } catch (error) {
      console.error("Failed to load deliveries", error);
    }
  };

  const loadReviews = async () => {
    try {
      // Fetch Pending Reviews from backend
      // Note: If backend returns a single Optional, we wrap it in array. If List, we use as is.
      const data = await productManagerAPI.getPendingReviews();
      const dataArray = Array.isArray(data) ? data : (data ? [data] : []);

      const mappedReviews: ProductReview[] = dataArray.map((r: any) => ({
        id: r.id.toString(),
        userName: r.user ? r.user.name : 'Anonymous', // Handling potential null user
        productName: r.product ? r.product.name : 'Unknown Product',
        productId: r.product ? r.product.id.toString() : '0',
        rating: r.rating,
        comment: r.comment,
        date: r.createdAt,
        status: (r.status?.toLowerCase() || 'pending') as 'approved' | 'pending' | 'disapproved'
      }));
      setReviews(mappedReviews);
    } catch (error) {
      console.error("Failed to load reviews", error);
    }
  };



  const handleAddProduct = async (newProduct: Omit<Product, 'id'>) => {
    try {
      // Map frontend 'stockCount' back to backend 'quantity'
      const backendPayload = {
        ...newProduct,
        quantity: newProduct.stockCount,
        imageUrl: newProduct.image // Map frontend 'image' to backend 'imageUrl'
      };
      await productManagerAPI.addProduct(backendPayload);
      await loadProducts();
    } catch (error) {
      alert("Failed to add product");
    }
  };

  const handleUpdateProduct = async (id: string, updatedProduct: Product) => {
    try {
      const backendPayload = {
        ...updatedProduct,
        quantity: updatedProduct.stockCount,
        imageUrl: updatedProduct.image
      };

      await productManagerAPI.updateProduct(id, backendPayload);
      await loadProducts(); // Refresh the list
    } catch (error) {
      console.error("Failed to update product", error);
      alert("Failed to update product details");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await productManagerAPI.deleteProduct(id);
      await loadProducts();
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: 'delivered' | 'pending' | 'cancelled' | 'in_transit') => {
    try {
      // Backend expects UPPERCASE status usually (PENDING, DELIVERED)
      const backendStatus = status === 'delivered' ? 'DELIVERED' : status.toUpperCase();
      await productManagerAPI.updateOrderStatus(id, backendStatus);
      await loadDeliveries(); // Refresh list
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  const handleUpdateReviewStatus = async (id: string, status: 'approved' | 'pending' | 'disapproved') => {
    try {
      if (status === 'pending') return; // No action needed
      const isApproved = status === 'approved';
      await productManagerAPI.moderateReview(id, isApproved);
      await loadReviews(); // Refresh list to remove processed review
    } catch (error) {
      console.error("Failed to moderate review", error);
    }
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab as any);
  };



  if (activeTab === 'dashboard') {
    return <Pdashboard products={props.products || []} onBack={onBack} onNavigate={handleNavigate} onLogout={onLogout} />;
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
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onLogout={onLogout} // Pass to Pproducts
      />
    );
  }

  if (activeTab === 'stock') {
    return (
      <Pstock
        products={products}
        onBack={onBack}
        onNavigate={handleNavigate}
        onUpdateProduct={handleUpdateProduct}
      />
    );
  }

  if (activeTab === 'orders') {
    return (
      <Porders
        orders={Promise.resolve(deliveries)}
        onBack={onBack}
        onNavigate={handleNavigate}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />
    );
  }

  if (activeTab === 'reviews') {
    return (
      <Previews
        reviews={Promise.resolve(reviews)}
        onBack={onBack}
        onNavigate={handleNavigate}
        onUpdateReviewStatus={handleUpdateReviewStatus}
      />
    );
  }

  return null;
}