import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ENDPOINTS } from '../../../core/endpoints';
import { HttpClientService } from '../../../services/HttpClientService.service';
import { AuthService } from '../../../services/auth.service';
import { ItemTicketDTO } from '../../../dto/itemTicketDTO';


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
  historialCompras: ItemTicketDTO[] = [];

  constructor(
    private http: HttpClientService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    const cuentaId = this.authService.getUserIdFromToken();
    if (!cuentaId) return;

    const pathParams = new Map<string, string>();
    pathParams.set('cuentaId', cuentaId.toString());

    this.http.get<ItemTicketDTO[]>(ENDPOINTS.listarTicketsPorCuenta, pathParams)
      .subscribe({
        next: (tickets) => {
          this.historialCompras = tickets;
        },
        error: (err) => {
          console.error('Error al cargar historial de tickets', err);
        }
      });
  }

  openModal(ticket: ItemTicketDTO) {
    this.selectedEvent = ticket;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedEvent = null;
  }
}
