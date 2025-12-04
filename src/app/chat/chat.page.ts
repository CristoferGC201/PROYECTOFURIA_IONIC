import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonInput, 
  IonButton, IonIcon, IonText, IonItem, IonLabel, IonCard, 
  IonCardHeader, IonCardContent, IonButtons, IonToast 
} from '@ionic/angular/standalone';
// Importamos el servicio
import { DatabaseService } from '../servicio/database.service';
import { UserAccount } from '../interfaz/user';

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
    IonCard, IonCardHeader, IonCardContent, IonButtons, IonToast
  ],
})
export class ChatPage implements OnInit {
  
  modo: 'login' | 'registro' = 'login';
  email = '';
  password = '';
  nombre = '';

  constructor(private router: Router, private dbService: DatabaseService) {} 

  async ngOnInit() {
    // Inicializamos la base de datos al arrancar
    // (El servicio ya sabe si usar Web o Nativo internamente)
    try {
      await this.dbService.inicializarPlugin();
    } catch(e) { 
      console.log('Nota: La BD ya estaba iniciada o hubo un error leve', e); 
    }
  }

  cambiarModo(m: 'login' | 'registro') {
    this.modo = m;
    this.email = ''; 
    this.password = ''; 
    this.nombre = '';
  }

  // --- REGISTRO REAL ---
  async registrar() {
    if (!this.email || !this.password || !this.nombre) {
      alert('Por favor, completa todos los campos.'); 
      return;
    }

    const newUser: UserAccount = {
      name: this.nombre,
      email: this.email,
      password: this.password
    };

    try {
      // Llamamos al servicio real (Web o Nativo)
      await this.dbService.registrarUsuario(newUser);
      
      const dominio = this.email.split('@')[1];
      alert(`¡Registro exitoso! Tu dominio asignado es: ${dominio}`);
      this.cambiarModo('login');
      
    } catch (error: any) {
      console.error('Error capturado en registro:', error);

      // --- LÓGICA PARA MENSAJES AMIGABLES ---
      let mensajeMostrar = 'Ocurrió un error desconocido al registrar.';

      // 1. Error Web (Lanzado manualmente)
      if (error.message && error.message.includes('El correo ya existe')) {
        mensajeMostrar = '⚠️ Ese correo ya está registrado. Por favor inicia sesión.';
      }
      // 2. Error Nativo SQLite (Restricción UNIQUE)
      else if (JSON.stringify(error).includes('UNIQUE')) {
        mensajeMostrar = '⚠️ Ese correo ya está registrado en el celular.';
      }

      alert(mensajeMostrar);
    }
  }

  // --- LOGIN REAL ---
  async login() {
    try {
      const usuario = await this.dbService.login(this.email, this.password);

      if (usuario) {
        // Guardar sesión temporal
        localStorage.setItem('userId', usuario.id!.toString());
        localStorage.setItem('userName', usuario.name);
        localStorage.setItem('userDomain', usuario.domain!);
        
        console.log('Login correcto:', usuario);
        this.router.navigate(['/tabs/quejas']); 
      } else {
        alert('Correo o contraseña incorrectos.');
      }
    } catch (e) {
      console.error(e);
      alert('Error técnico al iniciar sesión. Revisa la consola.');
    }
  }
}