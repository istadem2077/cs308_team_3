import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ProductsComponent } from './pages/products/products';
import { ProductDetailComponent } from './pages/product-detail/product-detail';
import { CategoriesComponent } from './pages/categories/categories';


import { Cart } from './pages/cart/cart';
import { OrderHistoryComponent } from './pages/order-history/order-history';
import { OrderConfirmationComponent } from './pages/order-confirmation/order-confirmation';

export const routes: Routes = [
    { path: '', component: HomeComponent }, // default route
    { path: 'products', component: ProductsComponent },
    { path: 'product-detail/:id', component: ProductDetailComponent },
    { path: 'categories', component: CategoriesComponent },
    { path: 'cart', component: Cart },
    { path: 'orders', component: OrderHistoryComponent },
    { path: 'order-confirmation/:id', component: OrderConfirmationComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '' },
  
];
