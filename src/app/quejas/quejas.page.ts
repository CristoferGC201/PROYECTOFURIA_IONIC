import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
  IonInput, IonFooter, IonList, IonLabel, IonIcon, 
  IonButtons 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-quejas',
  templateUrl: 'quejas.page.html',
  styleUrls: ['quejas.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonButton, IonInput, IonFooter, IonList, IonLabel, IonIcon,
    IonButtons
  ],
})
export class QuejasPage { 

  @ViewChild(IonContent, { static: false }) content!: IonContent;

  // ------------------------------------------
  // NUEVO: estructura para múltiples conversaciones
  // ------------------------------------------
  conversaciones: any[] = [];

  indiceConversacionActiva = 0;
  botEscribiendo = false;

  constructor() {
    this.nuevaConversacion();  // crea la primera por defecto
  }

  get conversacion() {
    return this.conversaciones[this.indiceConversacionActiva];
  }

  get listaChats() {
    return this.conversaciones.map((c, i) => ({
      nombre: `Chat ${i + 1}`,
      estado: c.conversacionActiva ? 'Activo' : 'Finalizado'
    }));
  }

  // Crear un nuevo chat vacío
  nuevaConversacion() {
    this.conversaciones.push({
      mensajes: [],
      opciones: [
        'No recibí mi pedido',
        'Producto defectuoso',
        'Cobro incorrecto',
        'Atención al cliente deficiente',
        'Otro'
      ],
      paso: 0,
      entradaUsuario: '',
      motivo: '',
      conversacionActiva: true
    });

    this.indiceConversacionActiva = this.conversaciones.length - 1;
    this.iniciarConversacion();
  }

  abrirConversacion(i: number) {
    this.indiceConversacionActiva = i;
    setTimeout(() => this.scrollToBottom(), 100);
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content) {
        this.content.scrollToBottom(300);
      }
    }, 80);
  }

  // ------------------------------------------
  // SISTEMA DE CONVERSACIÓN
  // ------------------------------------------
  iniciarConversacion() {
    const conv = this.conversacion;
    conv.mensajes = [];
    conv.paso = 0;
    conv.motivo = '';
    conv.entradaUsuario = '';
    conv.conversacionActiva = true;

    this.escribirBot('Hola 👋 ¿Cuál es el motivo de tu queja?');
  }

  seleccionarMotivo(opcion: string) {
    const conv = this.conversacion;

    conv.motivo = opcion;
    conv.mensajes.push({ autor: 'usuario', texto: opcion });

    this.escribirBot(this.generarPreguntaInicial(opcion));

    conv.paso = 1;
  }

  enviarMensaje() {
    const conv = this.conversacion;

    if (!conv.entradaUsuario.trim()) return;

    conv.mensajes.push({ autor: 'usuario', texto: conv.entradaUsuario });

    if (conv.paso === 1) {
      this.escribirBot(this.generarPreguntaDerivada(conv.motivo));
    } 
    else if (conv.paso === 2) {
      this.escribirBot(this.generarRespuestaFinal(conv.motivo));
      conv.conversacionActiva = false;
    }

    conv.entradaUsuario = '';
    conv.paso++;
  }

  // ------------------------------------------
  // EFECTO: EL BOT “ESCRIBE”
  // ------------------------------------------
  escribirBot(texto: string) {
    this.botEscribiendo = true;
    
    setTimeout(() => {
      this.conversacion.mensajes.push({ autor: 'sistema', texto });
      this.botEscribiendo = false;
      this.scrollToBottom();
    }, 600);
  }

  // ------------------------------------------
  // LÓGICA DEL CHATBOT
  // ------------------------------------------
  generarPreguntaInicial(motivo: string): string {
    switch (motivo) {
      case 'No recibí mi pedido': return '¿Cuándo hiciste tu pedido?';
      case 'Producto defectuoso': return '¿Qué tipo de defecto tiene el producto?';
      case 'Cobro incorrecto': return '¿Fue un cobro duplicado o un monto incorrecto?';
      case 'Atención al cliente deficiente': return '¿Qué aspecto fue problemático?';
      default: return 'Por favor, describe brevemente tu problema.';
    }
  }

  generarPreguntaDerivada(motivo: string): string {
    switch (motivo) {
      case 'No recibí mi pedido': return '¿Recibiste algún número de seguimiento?';
      case 'Producto defectuoso': return '¿Quieres reemplazo o reembolso?';
      case 'Cobro incorrecto': return '¿Tienes el comprobante de pago?';
      case 'Atención al cliente deficiente': return '¿Deseas que te contacte un supervisor?';
      default: return 'Gracias, estamos revisando tu caso.';
    }
  }

  generarRespuestaFinal(motivo: string): string {
    switch (motivo) {
      case 'No recibí mi pedido': return 'Estamos investigando tu pedido. Te contactaremos en menos de 24 horas.';
      case 'Producto defectuoso': return 'Tu solicitud de reemplazo está en proceso.';
      case 'Cobro incorrecto': return 'Tu reembolso está en trámite.';
      case 'Atención al cliente deficiente': return 'Un supervisor te contactará hoy mismo.';
      default: return 'Gracias por tu mensaje. Lo revisaremos pronto.';
    }
  }

}
