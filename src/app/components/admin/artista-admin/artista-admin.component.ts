import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientService } from '../../../services/HttpClientService.service';
import { ENDPOINTS } from '../../../core/endpoints';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalEditarArtistaComponent } from '../../../admin/artistas/modal-editar-artista.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-artista-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatDialogModule],
  templateUrl: './artista-admin.component.html',
  styleUrls: ['./artista-admin.component.css']
})
export class ArtistaAdminComponent implements OnInit {
  artistas: any[] = [];
  artistasFiltrados: any[] = [];
  filtro: string = '';
  artistaEditando: any = null;
  modalVisible: boolean = false;

  constructor(private httpClientService: HttpClientService,   private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarArtistas();
  }

  cargarArtistas() {
    this.httpClientService.get<any>(ENDPOINTS.listarArtistas).subscribe({
      next: (data) => {
        if (data?.error === true) {
          alert('Error al cargar artistas: ' + (data.mensaje || 'Error desconocido'));
          return;
        }
        this.artistas = data.respuesta || [];
        this.artistasFiltrados = [...this.artistas];
      },
      error: (err) => {
        console.error('Error al obtener artistas:', err);
        alert('Error al obtener artistas: ' + (err.error?.mensaje || err.message));
      }
    });
  }

  filtrarArtistas() {
    const texto = this.filtro.toLowerCase();
    this.artistasFiltrados = this.artistas.filter(a =>
      a.nombre.toLowerCase().includes(texto) ||
      a.genero.toLowerCase().includes(texto) ||
      a.email.toLowerCase().includes(texto) ||
      a.telefono.includes(texto)
    );
  }

  abrirModalEdicion(artista: any) {
    console.log(artista);
    const dialogRef = this.dialog.open(ModalEditarArtistaComponent, {
      data: artista,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const body = {
          id: artista.id,
          nombre: result.nombre,
          genero: result.genero,
          email: result.email,
          telefono: result.telefono,
          estado: result.estado.toUpperCase()
        };

        this.httpClientService.put<any>(ENDPOINTS.editarArtista, body).subscribe({
          next: (data) => {
            if (data?.error === true) {
              alert('Error al editar artista: ' + (data.mensaje || 'Error desconocido'));
              return;
            }
            alert('Artista actualizado exitosamente');
            this.cargarArtistas();
          },
          error: (err) => {
            console.error('Error al editar artista:', err);
            alert('Error al editar artista: ' + (err.error?.mensaje || err.message));
          }
        });
      }
    });
  }



  cerrarModal() {
    this.modalVisible = false;
    this.artistaEditando = null;
  }

  guardarCambios() {
    const body = {
      id: this.artistaEditando.id,
      nombre: this.artistaEditando.nombre,
      genero: this.artistaEditando.genero,
      email: this.artistaEditando.email,
      telefono: this.artistaEditando.telefono,
      estado: this.artistaEditando.estado.toUpperCase()
    };

    this.httpClientService.put<any>(ENDPOINTS.editarArtista, body).subscribe({
      next: (data) => {
        if (data?.error === true) {
          alert('Error al editar artista: ' + (data.mensaje || 'Error desconocido'));
          return;
        }

        alert('Artista actualizado exitosamente');
        this.cerrarModal();
        this.cargarArtistas();
      },
      error: (err) => {
        console.error('Error al editar artista:', err);
        alert('Error al editar artista: ' + (err.error?.mensaje || err.message));
      }
    });
  }

  eliminarArtista(artista: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Confirmar Eliminación',
        mensaje: `¿Estás seguro de eliminar a "${artista.nombre}"? Esta acción no se puede deshacer.`,
        confirmBtn: 'Eliminar',
        cancelBtn: 'Cancelar'
      },
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        const pathParams = new Map<string, string>();
        pathParams.set('id', artista.id.toString());

        this.httpClientService.delete<any>(ENDPOINTS.eliminarArtista, pathParams).subscribe({
          next: (data) => {
            if (data?.error === true) {
              alert('Error al eliminar artista: ' + (data.mensaje || 'Error desconocido'));
              return;
            }
            alert('Artista eliminado exitosamente');
            this.cargarArtistas();
          },
          error: (err) => {
            console.error('Error al eliminar artista:', err);
            alert('Error al eliminar artista: ' + (err.error?.mensaje || err.message));
          }
        });
      }
    });
  }
}
