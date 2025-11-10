import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '', 
    component: TabsPage,
    children: [
      // Eliminamos la ruta 'chat' de aquí.

      {
        // Pestaña de Quejas (Chatbot)
        path: 'quejas', 
        loadComponent: () => import('../quejas/quejas.page').then((m) => m.QuejasPage),
      },
      {
        // Pestaña de Configuración (Ejemplo)
        path: 'tab3', 
        loadComponent: () => import('../tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        // Redirección por defecto dentro de las pestañas
        path: '',
        redirectTo: 'quejas', 
        pathMatch: 'full',
      },
    ],
  },
];