import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonInput, 
  IonButton, IonIcon, IonText, IonItem, IonLabel, IonCard, 
  IonCardHeader, IonCardContent, IonButtons
} from '@ionic/angular/standalone';
// Importamos el servicio, aunque NO se usará en este modo
import { DatabaseService } from '../servicio/database.service';
import { UserAccount } from '../interfaz/user';

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.page.html',
  styleUrls: ['chat.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonIcon, IonText, IonItem, IonLabel, IonCard, IonCardHeader, IonCardContent, IonButtons],
})
export class ChatPage implements OnInit {
  
  modo: 'login' | 'registro' = 'login';
  email = '';
  password = '';
  nombre = '';

  constructor(private router: Router, private dbService: DatabaseService) {} 

  async ngOnInit() {
    // 🛑 BLOQUE DE CÓDIGO COMENTADO TEMPORALMENTE PARA PRUEBAS WEB 🛑
    // Si deseas probar la base de datos en el emulador, DEBES DESCOMENTAR ESTE BLOQUE.
    /*
    try {
      await this.dbService.inicializarPlugin();
    } catch(e) { console.log('BD ya iniciada, o error al cargar en web', e); }
    */
  }

  cambiarModo(m: 'login' | 'registro') {
    this.modo = m;
    this.email = ''; this.password = ''; this.nombre = '';
  }

  async registrar() {
    if (!this.email || !this.password || !this.nombre) {
      alert('Completa todos los campos'); return;
    }

    // 🛑 LÓGICA TEMPORAL PARA PRUEBAS WEB 🛑
    console.log('[MODO WEB] Intentando registrar a ${this.email}');
    alert('Registro simulado exitoso. Usa credenciales de prueba.');
    this.cambiarModo('login');
    
    // --------------------------------------------------------------------------------
    // --- ESTE CÓDIGO DEBE SER DESCOMENTADO PARA PRUEBAS NATIVAS CON BASE DE DATOS ---
    /*     const newUser: UserAccount = { name: this.nombre, email: this.email, password: this.password };

    try {
      await this.dbService.registrarUsuario(newUser);
      const dominio = this.email.split('@')[1];
      alert(¡Registrado! Tu dominio es: ${dominio});
      this.cambiarModo('login');
    } catch (error) {
      alert('Error: El correo ya existe.');
    }
    */
    // --------------------------------------------------------------------------------
  }

  async login() {
    if (!this.email || !this.password) {
      alert('Ingresa credenciales.'); return;
    }
    
    // 🛑 LÓGICA TEMPORAL PARA PRUEBAS WEB (Usar credenciales fijas) 🛑
    if (this.email === 'test@test.com' && this.password === '123') {
        // Simulamos la sesión mínima para que las rutas funcionen
        localStorage.setItem('userId', '999'); 
        localStorage.setItem('userName', 'Test User');
        localStorage.setItem('userDomain', 'test.com');
        
        console.log('[MODO WEB] Login simulado exitoso.');
        this.router.navigate(['/tabs/quejas']); 
    } else {
        alert('Credenciales simuladas incorrectas. Usa test@test.com / 123');
    }

    // --------------------------------------------------------------------------------
    // --- ESTE CÓDIGO DEBE SER DESCOMENTADO PARA PRUEBAS NATIVAS CON BASE DE DATOS ---
    /*
    try {
      const usuario = await this.dbService.login(this.email, this.password);

      if (usuario) {
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
    */
    // --------------------------------------------------------------------------------
  }
}