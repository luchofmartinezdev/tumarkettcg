import { Routes } from '@angular/router';
import { CardFormComponent } from './features/marketplace/card-form/card-form';
import { MyPostsComponent } from './features/marketplace/my-posts/my-posts';
import { LoginComponent } from './features/auth/login/login';
import { authGuard } from './core/guards/auth-guard';
import { HomeComponent } from './features/marketplace/home/home';
import { ExplorerComponent } from './features/marketplace/explorer/explorer';
import { TradeType } from './core/models/site-config.model';
import { CardDetailComponent } from './features/card-detail/card-detail';

export const routes: Routes = [
    { path: '', component: HomeComponent }, // El listado ahora es la Home
    { path: 'login', component: LoginComponent },
    { path: 'card/:id', component: CardDetailComponent },

    {
        path: 'vendo',
        component: ExplorerComponent,
        data: { type: TradeType.VENDO } // Usá el Enum directamente acá también si es posible
    },
    {
        path: 'busco',
        component: ExplorerComponent,
        data: { type: TradeType.BUSCO }
    },


    { path: 'publicar', component: CardFormComponent, canActivate: [authGuard] }, // El formulario en su propia URL
    { path: 'editar/:id', component: CardFormComponent, canActivate: [authGuard] },
    
    { path: 'mis-anuncios', component: MyPostsComponent, canActivate: [authGuard] }, // <--- Nueva ruta
    { path: '**', redirectTo: '' },
];