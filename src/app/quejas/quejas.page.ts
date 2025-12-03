import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
  IonInput, IonFooter, IonList, IonLabel, IonIcon, IonButtons 
} from '@ionic/angular/standalone';
import { DatabaseService } from '../servicio/database.service';

@Component({
  selector: 'app-quejas',
  templateUrl: 'quejas.page.html',
  styleUrls: ['quejas.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonFooter, IonList, IonLabel, IonIcon, IonButtons],
})
export class QuejasPage implements OnInit { 

  @ViewChild(IonContent) content!: IonContent;

  // Variables de Estado
  chats: any[] = [{ id: 1, titulo: 'Chat de Prueba Web', estado: 'Activo' }]; // Chat de prueba simulado
  chatActivo: any = null;
  mensajes: any[] = []; 

  userId: number = 0;
  botEscribiendo = false;
  entradaUsuario = '';
  pasoConversacion = 0;
  
  opciones = ['No recibí mi pedido', 'Producto defectuoso', 'Cobro incorrecto', 'Atención al cliente', 'Otro'];

  // Bandera para saber si estamos en el modo de prueba web
  isWebTest: boolean = false; 

  constructor(private dbService: DatabaseService) {}

  async ngOnInit() {
    this.userId = parseInt(localStorage.getItem('userId') || '0');
    // Si el userId es el de prueba (999), activamos el modo webtest
    this.isWebTest = (this.userId === 999); 
    
    if (this.userId) await this.cargarChats();
  }

  async cargarChats() {
    // --- LÓGICA DE SIMULACIÓN PARA WEB TEST ---
    if (this.isWebTest) {
      this.chats = [{ id: 1, titulo: 'Chat de Prueba Web', estado: 'Activo' }];
      this.seleccionarChat(this.chats[0]);
      return;
    }
    // ------------------------------------------

    // --- LÓGICA REAL (SQLITE) ---
    this.chats = await this.dbService.obtenerChats(this.userId);
    if (this.chats.length === 0) await this.nuevaConversacion();
    else this.seleccionarChat(this.chats[0]);
  }

  async nuevaConversacion() {
    // Si es modo web, solo reseteamos el array
    if (this.isWebTest) {
      this.mensajes = [];
      this.chatActivo = { id: 1, titulo: 'Chat de Prueba Web', estado: 'Activo' };
      this.escribirBot(1, 'Hola 👋 ¿Cuál es el motivo de tu queja?');
      this.pasoConversacion = 0;
      return;
    }

    // --- LÓGICA REAL (SQLITE) ---
    const titulo = 'Queja #${this.chats.length + 1}';
    const nuevoId = await this.dbService.crearChat(this.userId, titulo);
    if(nuevoId) {
      await this.cargarChats();
      const nuevo = this.chats.find(c => c.id === nuevoId);
      if(nuevo) this.seleccionarChat(nuevo);
      
      this.escribirBot(nuevoId, 'Hola 👋 ¿Cuál es el motivo de tu queja?');
      this.pasoConversacion = 0;
    }
  }

  async seleccionarChat(chat: any) {
    this.chatActivo = chat;
    
    // --- LÓGICA DE SIMULACIÓN PARA WEB TEST ---
    if (this.isWebTest) {
      // Cargamos mensajes simulados (si existieran)
      this.mensajes = this.mensajes.length > 0 ? this.mensajes : [];
      this.scrollToBottom();
      return;
    }
    // ------------------------------------------

    // --- LÓGICA REAL (SQLITE) ---
    this.mensajes = await this.dbService.obtenerMensajes(chat.id);
    this.scrollToBottom();
    this.pasoConversacion = this.mensajes.length > 2 ? 99 : 0;
  }

  async enviarMensaje() {
    if (!this.entradaUsuario.trim() || !this.chatActivo) return;
    const txt = this.entradaUsuario;
    this.entradaUsuario = '';

    // Guardar mensaje en el array temporal o en la DB
    this.mensajes.push({ text: txt, autor: 'usuario' });
    
    // Solo si no estamos en modo web, guardamos en la DB
    if (!this.isWebTest) {
      await this.dbService.guardarMensaje(this.chatActivo.id, txt, 'usuario');
    }
    
    this.scrollToBottom();

    // Lógica básica del bot (funciona igual en ambos modos)
    if (this.pasoConversacion === 1) {
      this.escribirBot(this.chatActivo.id, 'Entendido. ¿Algo más?');
      this.pasoConversacion = 2;
    } else if (this.pasoConversacion === 2) {
      this.escribirBot(this.chatActivo.id, 'Gracias. Caso registrado.');
      this.pasoConversacion = 3;
    }
  }

  async seleccionarMotivo(op: string) {
    if(!this.chatActivo) return;
    
    this.mensajes.push({ text: op, autor: 'usuario' });
    
    // Solo si no estamos en modo web, guardamos en la DB
    if (!this.isWebTest) {
      await this.dbService.guardarMensaje(this.chatActivo.id, op, 'usuario');
    }
    
    this.escribirBot(this.chatActivo.id, '¿Podrías darnos más detalles?');
    this.pasoConversacion = 1;
  }

  async escribirBot(chatId: number, txt: string) {
    this.botEscribiendo = true;
    setTimeout(async () => {
      
      // Solo si no estamos en modo web, guardamos en la DB
      if (!this.isWebTest) {
        await this.dbService.guardarMensaje(chatId, txt, 'sistema');
      }

      if(this.chatActivo && this.chatActivo.id === chatId) {
        this.mensajes.push({ text: txt, autor: 'sistema' });
        this.scrollToBottom();
      }
      this.botEscribiendo = false;
    }, 600);
  }

  scrollToBottom() { setTimeout(() => { if(this.content) this.content.scrollToBottom(300); }, 100); }

  // ... (otros métodos) ...
}