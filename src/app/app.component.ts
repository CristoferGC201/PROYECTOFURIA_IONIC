import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // 1. IMPORTAR SCHEMA
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 2. AGREGAR ESTA LÍNEA
})
export class AppComponent {
  constructor() {}
}