import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList, IonItem, IonLabel, IonNote } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab3',
  template: `
    <ion-header><ion-toolbar color="primary"><ion-title>Perfil</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item><ion-label>Usuario:</ion-label><ion-note slot="end">{{ nombre }}</ion-note></ion-item>
        <ion-item><ion-label>Dominio:</ion-label><ion-note slot="end" color="success"><b>{{ dominio }}</b></ion-note></ion-item>
      </ion-list>
      <br>
      <ion-button expand="block" color="danger" (click)="logout()">Cerrar Sesión</ion-button>
    </ion-content>
  `,
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList, IonItem, IonLabel, IonNote],
})
export class Tab3Page implements OnInit {
  nombre = '';
  dominio = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.nombre = localStorage.getItem('userName') || 'Anonimo';
    this.dominio = localStorage.getItem('userDomain') || 'Sin Dominio';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}