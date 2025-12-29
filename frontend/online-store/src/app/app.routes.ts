import { Routes } from '@angular/router';
// Core App Components (assuming they exist)
import { HomeComponent } from './pages/home/home';
import { ProductsComponent } from './pages/products/products';
import { ProductDetailComponent } from './pages/product-detail/product-detail';
import { CategoriesComponent } from './pages/categories/categories';
import { CartComponent } from './pages/cart/cart';

// Order Management Components
import { OrderHistoryComponent } from './pages/order-history/order-history';
import { OrderDetailComponent } from './pages/order-detail/order-detail';
import { OrderConfirmationComponent } from './pages/order-confirmation/order-confirmation';

// Authentication Components (NEW)
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';


export const routes: Routes = [
    // Primary Landing Page
    { path: '', redirectTo: '/home', pathMatch: 'full' }, 
    { path: 'home', component: HomeComponent, title: 'Home' },
    { path: 'profile', 
        loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent)},
    { path: 'update-address', 
        loadComponent: () => import('./pages/update-address/update-address').then(m => m.UpdateAddressComponent)},
    { path: 'update-password', 
        loadComponent: () => import('./pages/update-password/update-password').then(m => m.UpdatePasswordComponent)},


    // Product/Catalog Routes
    { path: 'products', component: ProductsComponent, title: 'Products' },
    { path: 'product-detail/:id', component: ProductDetailComponent, title: 'Product Detail' },
    { path: 'categories', component: CategoriesComponent, title: 'Categories' },

    // Cart Routes
    { path: 'cart', component: CartComponent, title: 'Shopping Cart' },

    // Authentication Routes
    { path: 'login', component: LoginComponent, title: 'Login' },
    { path: 'register', component: RegisterComponent, title: 'Register' },

    // Order Routes (Consolidated to use '/history' for the list)
    { path: 'history', component: OrderHistoryComponent, title: 'Order History' },
    { path: 'order/:id', component: OrderDetailComponent, title: 'Order Details' },
    { path: 'order-confirmation/:id', component: OrderConfirmationComponent, title: 'Order Confirmed' },

    // Wildcard route for 404
    { path: '**', redirectTo: '/home' }, 
];