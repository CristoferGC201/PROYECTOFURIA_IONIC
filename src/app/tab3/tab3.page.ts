import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
  IonList, IonItem, IonLabel, IonNote, IonIcon, 
  IonToggle 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline, moonOutline, eyeOutline, textOutline, personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    FormsModule, 
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
    IonList, IonItem, IonLabel, IonNote, IonIcon,
    IonToggle
  ],
})
export class Tab3Page implements OnInit {
  nombre = '';
  dominio = '';

  // Variables
  modoOscuro = false;
  modoDaltonicos = false;
  tamanoLetra = '16px';

  constructor(private router: Router) {
    addIcons({ logOutOutline, moonOutline, eyeOutline, textOutline, personCircleOutline });
  }

  ngOnInit() {
    this.nombre = localStorage.getItem('userName') || 'Usuario';
    this.dominio = localStorage.getItem('userDomain') || 'Sin Dominio';
    this.modoOscuro = document.body.classList.contains('dark');
  }

  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userDomain');
    this.router.navigate(['/login']);
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark', this.modoOscuro);
  }

  toggleDaltonicos() {
    document.body.classList.toggle('daltonicos', this.modoDaltonicos);
  }

  // --- FUNCIÓN PARA EL SELECTOR NATIVO ---
  cambiarTamanoNativo(event: any) {
    // Obtenemos el valor directamente del evento HTML
    const valor = event.target.value;
    this.tamanoLetra = valor;
    
    // Aplicamos el cambio al documento
    document.documentElement.style.fontSize = this.tamanoLetra;
    console.log('Tamaño cambiado a:', this.tamanoLetra);
  }
}