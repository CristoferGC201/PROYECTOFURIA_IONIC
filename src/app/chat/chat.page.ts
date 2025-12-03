import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonInput, 
  IonButton, IonIcon, IonText, IonItem, IonLabel, IonCard, 
  IonCardHeader, IonCardContent, IonButtons, IonToast 
} from '@ionic/angular/standalone';
// Importamos el servicio desde la carpeta 'servicio'
import { DatabaseService } from '../servicio/database.service';
import { UserAccount } from '../interfaz/user';

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.page.html',
  styleUrls: ['chat.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonIcon, IonText, IonItem, IonLabel, IonCard, IonCardHeader, IonCardContent, IonButtons, IonToast],
})
export class ChatPage implements OnInit {
  
  modo: 'login' | 'registro' = 'login';
  email = '';
  password = '';
  nombre = '';

  constructor(private router: Router, private dbService: DatabaseService) {} 

  async ngOnInit() {
    // INICIALIZAR BD AL ARRANCAR
    try {
      await this.dbService.inicializarPlugin();
    } catch(e) { console.log('BD ya iniciada', e); }
  }

  cambiarModo(m: 'login' | 'registro') {
    this.modo = m;
    this.email = ''; this.password = ''; this.nombre = '';
  }

  async registrar() {
    if (!this.email || !this.password || !this.nombre) {
      alert('Completa todos los campos'); return;
    }

    const newUser: UserAccount = {
      name: this.nombre,
      email: this.email,
      password: this.password
    };

    try {
      await this.dbService.registrarUsuario(newUser);
      // Mostramos el dominio para confirmar que funcionó
      const dominio = this.email.split('@')[1];
      alert(`¡Registrado! Tu dominio es: ${dominio}`);
      this.cambiarModo('login');
    } catch (error) {
      alert('Error: El correo ya existe.');
    }
  }

  async login() {
    try {
      const usuario = await this.dbService.login(this.email, this.password);

      if (usuario) {
        // Guardar sesión temporalmente
        localStorage.setItem('userId', usuario.id!.toString());
        localStorage.setItem('userName', usuario.name);
        localStorage.setItem('userDomain', usuario.domain!);
        
        this.router.navigate(['/tabs/quejas']); 
      } else {
        alert('Credenciales incorrectas');
      }
    } catch (e) {
      alert('Error al iniciar sesión');
    }
  }
}