import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-historial-compras',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './historial-compras.component.html',
  styleUrl: './historial-compras.component.css'
})
export class HistorialComprasComponent {

  searchText: string = '';
  showModal: boolean = false;
  selectedEvent: any = null;

  historialCompras = [
    {
      id: 'P001',
      evento: 'Concierto de Rock',
      fecha: '14/07/2022',
      cantidad: 2,
      total: 150000,
      estado: 'Completado',
      cupones: 'ROCK2024',
      descripcion: 'Concierto de Rock en vivo',
      lugar: 'Estadio Principal',
      localidades: {
        vip: { precio: 80000, disponible: '200/200' },
        platea: { precio: 60000, disponible: '300/300' },
        general: { precio: 50000, disponible: '300/300' }
      }
    },
    {
      id: 'P002',
      evento: 'Festival de Jazz',
      fecha: '08/12/2023',
      cantidad: 1,
      total: 80000,
      estado: 'Cancelado',
      cupones: '----------',
      descripcion: 'Festival de Jazz Internacional',
      lugar: 'Teatro Municipal',
      localidades: {
        vip: { precio: 80000, disponible: '150/150' },
        platea: { precio: 60000, disponible: '200/200' },
        general: { precio: 40000, disponible: '250/250' }
      }
    },
    {
      id: 'P003',
      evento: 'Concierto de Piano',
      fecha: '14/07/2022',
      cantidad: 2,
      total: 150000,
      estado: 'Completado',
      cupones: 'PIANO14',
      descripcion: 'Concierto de piano en vivo',
      lugar: 'Estadio Principal',
      localidades: {
        vip: { precio: 80000, disponible: '200/200' },
        platea: { precio: 60000, disponible: '300/300' },
        general: { precio: 50000, disponible: '300/300' }
      }
    },
    {
      id: 'P004',
      evento: 'Regocijo Espiritual',
      fecha: '08/12/2023',
      cantidad: 1,
      total: 80000,
      estado: 'Cancelado',
      cupones: '----------',
      descripcion: 'Festival de adoracion',
      lugar: 'Teatro Municipal',
      localidades: {
        vip: { precio: 80000, disponible: '150/150' },
        platea: { precio: 60000, disponible: '200/200' },
        general: { precio: 40000, disponible: '250/250' }
      }
    },
    {
      id: 'P005',
      evento: 'Circo Del Sol',
      fecha: '08/12/2023',
      cantidad: 1,
      total: 80000,
      estado: 'Completado',
      cupones: '----------',
      descripcion: 'Los mejores malabaristas del mundo',
      lugar: 'Coliseo Cubierto',
      localidades: {
        vip: { precio: 80000, disponible: '150/150' },
        platea: { precio: 60000, disponible: '200/200' },
        general: { precio: 40000, disponible: '250/250' }
      }
    },
    // ... más eventos
  ];

  openModal(evento: any) {
    this.selectedEvent = evento;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedEvent = null;
  }
}
