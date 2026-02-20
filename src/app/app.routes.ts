import { Routes } from '@angular/router'; 

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/landing/landing').then(m => m.Landing)
    },
    {
        path: 'producto/:id',
        loadComponent: () => import('./features/product-detail/product-detail').then(m => m.ProductDetail)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
