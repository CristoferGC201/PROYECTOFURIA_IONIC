import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonInput, 
  IonButton, IonIcon, IonText, IonItem, IonLabel, IonCard, 
  IonCardHeader, IonCardContent, IonButtons 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.page.html',
  styleUrls: ['chat.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonInput, IonButton, IonIcon, IonText, IonItem, IonLabel, 
    IonCard, IonCardHeader, IonCardContent, IonButtons
  ],
})
export class ChatPage {
  
  modo: 'login' | 'registro' = 'login';
  email = '';
  password = '';
  nombre = '';

  constructor(private router: Router) {} 

  cambiarModo(m: 'login' | 'registro') {
    this.modo = m;
    this.email = '';
    this.password = '';
    this.nombre = '';
  }

  registrar() {
    if (!this.email || !this.password || !this.nombre) {
      console.error('Completa todos los campos'); 
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    if (usuarios.some((u: any) => u.email === this.email)) {
      console.error('Correo ya registrado');
      return;
    }

    usuarios.push({ nombre: this.nombre, email: this.email, password: this.password });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    console.log('Registro exitoso, inicia sesión');
    this.cambiarModo('login');
  }

  login() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find((u: any) => u.email === this.email && u.password === this.password);

    if (usuario) {
      localStorage.setItem('usuarioActivo', usuario.nombre);
      // Redirige a la ruta principal de las pestañas
      this.router.navigate(['/tabs/quejas']); 
    } else {
      console.error('Correo o contraseña incorrectos');
    }
  }
}