import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { TradeType } from './core/models/site-config.model';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/home/home').then(m => m.HomeComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
    },
    {
        path: 'card/:slug',
        loadComponent: () => import('./features/card-detail/card-detail').then(m => m.CardDetailComponent)
    },
    {
        path: 'vendo',
        loadComponent: () => import('./features/catalog/catalog').then(m => m.CatalogComponent),
        data: { type: TradeType.VENDO }
    },
    {
        path: 'busco',
        loadComponent: () => import('./features/catalog/catalog').then(m => m.CatalogComponent),
        data: { type: TradeType.BUSCO }
    },
    {
        path: 'buscar',
        loadComponent: () => import('./features/search-results/search-results').then(m => m.SearchResultsComponent)
    },
    {
        path: 'publicar',
        loadComponent: () => import('./features/card-form/card-form').then(m => m.CardFormComponent),
        canActivate: [authGuard]
    },
    {
        path: 'editar/:slug',
        loadComponent: () => import('./features/card-form/card-form').then(m => m.CardFormComponent),
        canActivate: [authGuard]
    },
    {
        path: 'mis-anuncios',
        loadComponent: () => import('./features/my-posts/my-posts').then(m => m.MyPostsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'publicar-masivo',
        loadComponent: () => import('./features/bulk-upload/bulk-upload').then(m => m.BulkUploadComponent),
        canActivate: [authGuard]
    },
    {
        path: 'perfil',
        loadComponent: () => import('./features/profile/profile').then(m => m.ProfileComponent),
        canActivate: [authGuard],
        data: { tab: 'info' }
    },
    {
        path: 'perfil/anuncios',
        loadComponent: () => import('./features/profile/profile').then(m => m.ProfileComponent),
        canActivate: [authGuard],
        data: { tab: 'anuncios' }
    },
    {
        path: 'perfil/contactados',
        loadComponent: () => import('./features/profile/profile').then(m => m.ProfileComponent),
        canActivate: [authGuard],
        data: { tab: 'contactados' }
    },
    {
        path: 'perfil/favoritos',
        loadComponent: () => import('./features/profile/profile').then(m => m.ProfileComponent),
        canActivate: [authGuard],
        data: { tab: 'favoritos' }
    },
    {
        path: 'vendedor/:slug',
        loadComponent: () => import('./features/seller-profile/seller-profile').then(m => m.SellerProfileComponent)
    },
    { path: '**', redirectTo: '' }
];