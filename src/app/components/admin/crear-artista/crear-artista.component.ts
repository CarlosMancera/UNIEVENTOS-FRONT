import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientService } from '../../../services/HttpClientService.service';
import { ENDPOINTS } from '../../../core/endpoints';

@Component({
  selector: 'app-crear-artista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-artista.component.html',
  styleUrls: ['./crear-artista.component.css']
})
export class CrearArtistaComponent {
  nuevoArtista = {
    nombre: '',
    genero: '',
    email: '',
    telefono: ''
  };

  constructor(
    private router: Router,
    private httpClientService: HttpClientService
  ) {}

  guardarArtista() {
    const body = {
      nombre: this.nuevoArtista.nombre,
      genero: this.nuevoArtista.genero,
      email: this.nuevoArtista.email,
      telefono: this.nuevoArtista.telefono
    };

    this.httpClientService.post<any>(ENDPOINTS.crearArtista, body).subscribe({
      next: (data) => {
        if (data?.error === true) {
          alert('Error al crear el artista: ' + (data.mensaje || 'Error desconocido'));
          return;
        }

        alert('Artista creado exitosamente');
        this.router.navigate(['/admin/artistas']);
      },
      error: (err) => {
        console.error('Error al crear artista:', err);
        alert('Error al crear artista: ' + (err.error?.mensaje || err.message));
      }
    });
  }

  cancelar() {
    this.router.navigate(['/admin/artistas']);
  }
}
