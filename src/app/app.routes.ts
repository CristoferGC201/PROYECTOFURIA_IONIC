import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    // 1. RUTA DE AUTENTICACIÓN (LOGIN): Sin barra de pestañas.
    path: 'login',
    loadComponent: () => import('./chat/chat.page').then((m) => m.ChatPage),
  },
  {
    // 2. RUTA DE LAS PESTAÑAS: Carga las vistas con barra de navegación inferior.
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    // 3. REDIRECCIÓN PRINCIPAL: Al iniciar, va al Login.
    path: '',
    redirectTo: '/login', 
    pathMatch: 'full',
  },
];