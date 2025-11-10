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

  mensajes: { autor: 'sistema' | 'usuario', texto: string }[] = [];
  opciones = [
    'No recibí mi pedido',
    'Producto defectuoso',
    'Cobro incorrecto',
    'Atención al cliente deficiente',
    'Otro'
  ];
  paso = 0;
  entradaUsuario = '';
  motivo = '';
  conversacionActiva = false;
localStorage: any;

  constructor() {
    this.iniciarConversacion();
  }
  
  ionViewDidEnter() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content) {
          this.content.scrollToBottom(300);
      }
    }, 50);
  }

  iniciarConversacion() {
    this.mensajes = [];
    this.paso = 0;
    this.motivo = '';
    this.entradaUsuario = '';
    this.conversacionActiva = true;
    this.mensajes.push({ autor: 'sistema', texto: 'Hola 👋 ¿Cuál es el motivo de tu queja?' });
    this.scrollToBottom();
  }

  seleccionarMotivo(opcion: string) {
    this.motivo = opcion;
    this.mensajes.push({ autor: 'usuario', texto: opcion });
    this.mensajes.push({ autor: 'sistema', texto: this.generarPreguntaInicial(opcion) });
    this.paso = 1;
    this.scrollToBottom();
  }

  enviarMensaje() {
    if (!this.entradaUsuario.trim()) return;

    this.mensajes.push({ autor: 'usuario', texto: this.entradaUsuario });

    if (this.paso === 1) {
      this.mensajes.push({ autor: 'sistema', texto: this.generarPreguntaDerivada(this.motivo) });
    } else if (this.paso === 2) {
      this.mensajes.push({ autor: 'sistema', texto: this.generarRespuestaFinal(this.motivo) });
      this.conversacionActiva = false;
    }

    this.entradaUsuario = '';
    this.paso++;
    this.scrollToBottom();
  }

  // Lógica del Chatbot (Sin cambios)
  generarPreguntaInicial(motivo: string): string {
    switch (motivo) {
      case 'No recibí mi pedido': return '¿Cuándo hiciste tu pedido?';
      case 'Producto defectuoso': return '¿Qué tipo de defecto tiene el producto?';
      case 'Cobro incorrecto': return '¿Fue un cobro duplicado o un monto incorrecto?';
      case 'Atención al cliente deficiente': return '¿Qué aspecto fue problemático: tiempo de espera, actitud, solución?';
      default: return 'Por favor, describe brevemente tu problema.';
    }
  }

  generarPreguntaDerivada(motivo: string): string {
    switch (motivo) {
      case 'No recibí mi pedido': return '¿Recibiste algún número de seguimiento?';
      case 'Producto defectuoso': return '¿Quieres reemplazo o reembolso?';
      case 'Cobro incorrecto': return '¿Tienes el comprobante de pago?';
      case 'Atención al cliente deficiente': return '¿Quieres que te contacte un supervisor?';
      default: return 'Gracias, estamos revisando tu caso.';
    }
  }

  generarRespuestaFinal(motivo: string): string {
    switch (motivo) {
      case 'No recibí mi pedido': return 'Estamos investigando tu pedido. Te contactaremos en menos de 24 horas.';
      case 'Producto defectuoso': return 'Tu solicitud de reemplazo está en proceso. Recibirás novedades pronto.';
      case 'Cobro incorrecto': return 'Tu reembolso está en trámite. Lo verás reflejado en 3 a 5 días hábiles.';
      case 'Atención al cliente deficiente': return 'Un supervisor se pondrá en contacto contigo hoy mismo.';
      default: return 'Gracias por tu mensaje. Nuestro equipo lo revisará y te responderá pronto.';
    }
  }
}