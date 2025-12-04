import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
  IonInput, IonFooter, IonList, IonLabel, IonIcon, IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, addOutline, sendOutline, addCircleOutline } from 'ionicons/icons';
import { DatabaseService } from '../servicio/database.service';

@Component({
  selector: 'app-quejas',
  templateUrl: 'quejas.page.html',
  styleUrls: ['quejas.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, 
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonButton, IonInput, IonFooter, IonList, IonLabel, IonIcon, IonButtons
  ],
})
export class QuejasPage implements OnInit { 

  @ViewChild(IonContent) content!: IonContent;

  chats: any[] = [];
  chatActivo: any = null;
  mensajes: any[] = [];

  userId: number = 0;
  botEscribiendo = false;
  entradaUsuario = '';
  pasoConversacion = 0;
  
  opciones = ['No recibí mi pedido', 'Producto defectuoso', 'Cobro incorrecto', 'Atención al cliente', 'Otro'];

  constructor(private dbService: DatabaseService) {
    // Registramos iconos
    addIcons({ trashOutline, addOutline, sendOutline, addCircleOutline });
  }

  async ngOnInit() {
    this.userId = parseInt(localStorage.getItem('userId') || '0');
    if (this.userId) await this.cargarChats();
  }

  async cargarChats() {
    this.chats = await this.dbService.obtenerChats(this.userId);
    if (this.chats.length === 0) {
      await this.nuevaConversacion();
    } else {
      // Si no hay chat activo, intenta abrir el primero
      if (!this.chatActivo && this.chats.length > 0) {
        // Opcional: this.seleccionarChat(this.chats[0]);
      }
    }
  }

  async nuevaConversacion() {
    const titulo = `Queja #${this.chats.length + 1}`;
    const nuevoId = await this.dbService.crearChat(this.userId, titulo);
    if(nuevoId) {
      await this.cargarChats();
      const nuevo = this.chats.find(c => c.id === nuevoId);
      if(nuevo) {
        this.seleccionarChat(nuevo);
        this.escribirBot(nuevo.id, 'Hola 👋 ¿Cuál es el motivo de tu queja?');
        this.pasoConversacion = 0;
      }
    }
  }

  async seleccionarChat(chat: any) {
    this.chatActivo = chat;
    this.mensajes = await this.dbService.obtenerMensajes(chat.id);
    this.scrollToBottom();
    this.pasoConversacion = this.mensajes.length > 2 ? 99 : 0;
  }

  // --- 🛑 SOLUCIÓN DEFINITIVA: BORRADO NATIVO 🛑 ---
  async confirmarBorrado(chat: any, event: Event) {
    // 1. Detener propagación (para que no abra el chat al dar clic en borrar)
    event.stopPropagation();

    // 2. Usar la ventana de confirmación del sistema (No puede fallar)
    const confirmacion = window.confirm(`¿Estás seguro de borrar "${chat.titulo}"?`);

    if (confirmacion) {
      // Si el usuario dijo "Aceptar"
      await this.dbService.borrarChat(chat.id);
      
      // Limpiar pantalla si borramos el chat actual
      if (this.chatActivo && this.chatActivo.id === chat.id) {
        this.chatActivo = null;
        this.mensajes = [];
      }
      
      // Recargar lista
      await this.cargarChats();
    }
  }

  // --- CHAT LOGIC ---
  async enviarMensaje() {
    if (!this.entradaUsuario.trim() || !this.chatActivo) return;
    const txt = this.entradaUsuario;
    this.entradaUsuario = '';

    await this.dbService.guardarMensaje(this.chatActivo.id, txt, 'usuario');
    this.mensajes.push({ text: txt, autor: 'usuario' });
    this.scrollToBottom();

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
    await this.dbService.guardarMensaje(this.chatActivo.id, op, 'usuario');
    this.mensajes.push({ text: op, autor: 'usuario' });
    
    this.escribirBot(this.chatActivo.id, '¿Podrías darnos más detalles?');
    this.pasoConversacion = 1;
  }

  async escribirBot(chatId: number, txt: string) {
    this.botEscribiendo = true;
    setTimeout(async () => {
      await this.dbService.guardarMensaje(chatId, txt, 'sistema');
      if(this.chatActivo && this.chatActivo.id === chatId) {
        this.mensajes.push({ text: txt, autor: 'sistema' });
        this.scrollToBottom();
      }
      this.botEscribiendo = false;
    }, 600);
  }

  scrollToBottom() { setTimeout(() => { if(this.content) this.content.scrollToBottom(300); }, 100); }
}