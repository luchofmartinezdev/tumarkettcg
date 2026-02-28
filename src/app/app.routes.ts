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
        path: 'card/:id',
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
        path: 'editar/:id',
        loadComponent: () => import('./features/card-form/card-form').then(m => m.CardFormComponent),
        canActivate: [authGuard]
    },
    {
        path: 'mis-anuncios',
        loadComponent: () => import('./features/my-posts/my-posts').then(m => m.MyPostsComponent),
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
        path: 'perfil/contactos',
        loadComponent: () => import('./features/profile/profile').then(m => m.ProfileComponent),
        canActivate: [authGuard],
        data: { tab: 'contactos' }
    },
    {
        path: 'perfil/favoritos',
        loadComponent: () => import('./features/profile/profile').then(m => m.ProfileComponent),
        canActivate: [authGuard],
        data: { tab: 'favoritos' }
    },
    { path: '**', redirectTo: '' }
];