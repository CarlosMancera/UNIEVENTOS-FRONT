import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lista-deseos',
  standalone: true,
  imports: [ CommonModule, FormsModule, RouterModule],
  templateUrl: './lista-deseos.component.html',
  styleUrl: './lista-deseos.component.css'
})
export class ListaDeseosComponent {
  searchText: string = '';
  showModal: boolean = false;
  selectedEvent: any = null;
  
  listaDeseos = [
    {
      id: 'P009',
      evento: 'Concierto de Rock',
      fecha: '14/09/2024',
      estado: 'Pendiente',
      notificar: false,
      descripcion: 'Concierto de Rock en vivo',
      lugar: 'Estadio Principal',
      localidades: {
        vip: { precio: 80000, disponible: '200/200' },
        platea: { precio: 60000, disponible: '300/300' },
        general: { precio: 50000, disponible: '300/300' }
      }
    },
    {
      id: 'P009',
      evento: 'Concierto de Rock',
      fecha: '14/09/2024',
      estado: 'Pendiente',
      notificar: true
    },
    {
      id: 'P010',
      evento: 'ComicConn',
      fecha: '25/09/2024',
      estado: 'Pendiente',
      notificar: true
    },
    {
      id: 'P004',
      evento: 'Música para planchar',
      fecha: '28/12/2024',
      estado: 'Pendiente',
      notificar: false
    }
  ];

  toggleNotification(evento: any) {
    if (evento.notificar) {
      alert(`Se te notificará al correo electrónico registrado sobre el evento: ${evento.evento}`);
    }
  }

  openModal(evento: any) {
    this.selectedEvent = evento;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedEvent = null;
  }

}
